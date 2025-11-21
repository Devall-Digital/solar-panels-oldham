<?php
/**
 * API Endpoint: Solar Calculator
 * Purpose: Calculate solar panel savings and ROI
 * Author: Solar Calculator Agent
 * Date: 2025-11-21
 */

// Set headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

// Validate required fields
$required = ['bill', 'property', 'facing'];
$missing = [];

foreach ($required as $field) {
    if (!isset($input[$field])) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(400);
    die(json_encode([
        'error' => 'Missing required fields',
        'fields' => $missing
    ]));
}

// Sanitize and validate input
$monthlyBill = filter_var($input['bill'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$propertyType = filter_var($input['property'], FILTER_SANITIZE_STRING);
$roofFacing = filter_var($input['facing'], FILTER_SANITIZE_STRING);

// Validate ranges
if ($monthlyBill < 50 || $monthlyBill > 1000) {
    http_response_code(400);
    die(json_encode(['error' => 'Monthly bill must be between £50 and £1000']));
}

$validProperties = ['terraced', 'semi', 'detached', 'bungalow'];
if (!in_array($propertyType, $validProperties)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid property type']));
}

$validFacings = ['south', 'east-west', 'east', 'west', 'north'];
if (!in_array($roofFacing, $validFacings)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid roof facing']));
}

/**
 * Calculate solar panel savings
 */
class SolarCalculator {
    private $monthlyBill;
    private $propertyType;
    private $roofFacing;

    // Average UK solar generation factors (kWh per kWp per year)
    private $generationFactors = [
        'south' => 950,
        'east-west' => 875,
        'east' => 800,
        'west' => 800,
        'north' => 650
    ];

    // Property size factors (kWp capacity)
    private $propertySizes = [
        'terraced' => 3.5,
        'semi' => 4.5,
        'detached' => 6.0,
        'bungalow' => 5.0
    ];

    // Current UK energy prices and solar feed-in rates
    private $energyPrice = 0.28; // £ per kWh
    private $exportRate = 0.15; // £ per kWh exported
    private $systemCostPerKwp = 1800; // £ per kWp installed

    public function __construct($monthlyBill, $propertyType, $roofFacing) {
        $this->monthlyBill = $monthlyBill;
        $this->propertyType = $propertyType;
        $this->roofFacing = $roofFacing;
    }

    public function calculate() {
        $capacity = $this->propertySizes[$this->propertyType];
        $generationFactor = $this->generationFactors[$this->roofFacing];

        // Calculate annual generation
        $annualGeneration = $capacity * $generationFactor;

        // Calculate annual savings (assuming 50% self-consumption, 50% export)
        $selfConsumption = $annualGeneration * 0.5;
        $exportGeneration = $annualGeneration * 0.5;

        $annualSavings = ($selfConsumption * $this->energyPrice) + ($exportGeneration * $this->exportRate);

        // System cost
        $systemCost = $capacity * $this->systemCostPerKwp;

        // ROI calculation
        $roi = ($annualSavings / $systemCost) * 100;

        // Payback period
        $paybackYears = $systemCost / $annualSavings;

        // Additional benefits
        $co2Savings = $annualGeneration * 0.233; // kg CO2 per kWh avoided
        $treesEquivalent = $co2Savings / 25; // One tree absorbs ~25kg CO2 per year

        return [
            'capacity' => round($capacity, 1),
            'annualGeneration' => round($annualGeneration),
            'annualSavings' => round($annualSavings),
            'systemCost' => round($systemCost),
            'roi' => round($roi, 1),
            'paybackYears' => round($paybackYears, 1),
            'co2Savings' => round($co2Savings),
            'treesEquivalent' => round($treesEquivalent, 1),
            'monthlyBillReduction' => round($this->monthlyBill * 0.7), // Assume 70% reduction
            'twentyFiveYearSavings' => round($annualSavings * 25)
        ];
    }
}

// Perform calculation
$calculator = new SolarCalculator($monthlyBill, $propertyType, $roofFacing);
$results = $calculator->calculate();

// Log calculation for analytics (optional)
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'input' => $input,
    'results' => $results
];

// Save to analytics log (optional)
// Uncomment if you want to track calculations
/*
$analytics_dir = '../storage/analytics';
if (!is_dir($analytics_dir)) {
    mkdir($analytics_dir, 0755, true);
}

$log_file = $analytics_dir . '/calculations_' . date('Y-m-d') . '.json';
$logs = file_exists($log_file) ? json_decode(file_get_contents($log_file), true) : [];
$logs[] = $logEntry;
file_put_contents($log_file, json_encode($logs, JSON_PRETTY_PRINT));
*/

// Return results
echo json_encode([
    'success' => true,
    'data' => $results,
    'timestamp' => date('Y-m-d H:i:s'),
    'version' => '1.0'
]);

?>

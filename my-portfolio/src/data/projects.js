export const PROJECTS = [
  {
    id: 'psychescan',
    type: 'software',
    typeLabel: 'Research / AI',
    title: 'PsycheScan',
    date: '2025-06-01',
    description:
      'A real-time mental health early detection prototype using vital-sign sensors and a hybrid CNN-LSTM model for stress and anxiety indicators.',
    url: '',
    nodes: [
      { id: 'sensors', label: 'Vital sensors', kind: 'input' },
      { id: 'processor', label: 'Signal processing', kind: 'service' },
      { id: 'analysis', label: 'Mental health analysis', kind: 'output' },
    ],
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'smartpos',
    type: 'software',
    title: 'SmartPOS',
    date: '2026-01-08',
    description:
      'A role-based point-of-sale and decision support system for small businesses, with inventory tracking, sales summaries, and restock alerts.',
    url: '',
    nodes: [
      { id: 'cashier', label: 'Business user', kind: 'input' },
      { id: 'pos', label: 'Point-of-sale system', kind: 'service' },
      { id: 'dashboard', label: 'Sales & inventory dashboard', kind: 'data' },
    ],
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'protecttag',
    type: 'software',
    typeLabel: 'Software / App',
    title: 'ProtectTag',
    date: '2025-08-11',
    description:
      'A wearable safety tracking and fall detection system using ESP32, GPS, MPU6050, Firebase, and a live map interface for monitoring.',
    url: '',
    nodes: [
      { id: 'user', label: 'Wearer', kind: 'input' },
      { id: 'device', label: 'ESP32 tracker', kind: 'service' },
      { id: 'monitor', label: 'Live alerts & geofence', kind: 'output' },
    ],
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'hand-gesture-rover',
    type: 'hardware',
    typeLabel: 'Hardware / Rover',
    title: 'Hand-Gesture Rover',
    date: '2025-12-18',
    description:
      'An ESP32-powered rover controlled by hand gestures for intuitive movement, navigation feedback, and simple remote operation.',
    nodes: [
      { id: 'gesture', label: 'Hand gesture', kind: 'input' },
      { id: 'controller', label: 'Gesture logic', kind: 'service' },
      { id: 'rover', label: 'Movement output', kind: 'output' },
    ],
    code: `const int leftMotor = 9;
const int rightMotor = 10;

void setup() {
  pinMode(leftMotor, OUTPUT);
  pinMode(rightMotor, OUTPUT);
}

void loop() {
  // Gesture input mapped to drive commands
  analogWrite(leftMotor, 180);
  analogWrite(rightMotor, 180);
  delay(100);
}`,
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'smart-irrigation',
    type: 'hardware',
    title: 'Smart Irrigation System',
    date: '2025-03-12',
    description:
      'An automated watering system that reads soil moisture and activates irrigation based on plant needs without a microcontroller.',
    nodes: [
      { id: 'soil', label: 'Soil moisture', kind: 'input' },
      { id: 'controller', label: 'Analog logic controller', kind: 'service' },
      { id: 'pump', label: 'Water pump', kind: 'output' },
    ],
    code: `const int moisturePin = A0;
const int pumpPin = 8;
const int dryThreshold = 650;

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int moisture = analogRead(moisturePin);
  digitalWrite(pumpPin, moisture > dryThreshold ? HIGH : LOW);
  delay(1000);
}`,
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'hand-sanitizer',
    type: 'hardware',
    title: 'Contactless Hand Sanitizer',
    date: '2026-02-02',
    description:
      'A touch-free sanitizer dispenser that uses a proximity sensor and Arduino to release sanitizer automatically when motion is detected.',
    nodes: [
      { id: 'hand', label: 'Detected hand', kind: 'input' },
      { id: 'sensor', label: 'IR proximity sensor', kind: 'service' },
      { id: 'pump', label: 'Sanitizer pump', kind: 'output' },
    ],
    code: `const int sensorPin = 7;
const int pumpPin = 8;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(pumpPin, OUTPUT);
}

void loop() {
  bool handDetected = digitalRead(sensorPin) == LOW;
  digitalWrite(pumpPin, handDetected ? HIGH : LOW);
  delay(100);
}`,
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'colegio-website',
    type: 'software',
    title: 'Colegio de Muntinlupa Website',
    date: '2024-11-18',
    description:
      'A full school website with information pages, announcements, and student resource sections designed for accessibility and easy navigation.',
    url: '',
    nodes: [
      { id: 'visitor', label: 'Visitor', kind: 'input' },
      { id: 'website', label: 'School website', kind: 'service' },
      { id: 'content', label: 'School resources', kind: 'data' },
    ],
    likes: 0,
    dislikes: 0,
  },
  {
    id: 'cupang-website',
    type: 'software',
    title: 'Cupang Elementary Website',
    date: '2024-09-03',
    description:
      'An informational website for students and parents, built to make essential school information easier to find and use.',
    url: '',
    nodes: [
      { id: 'family', label: 'Students & parents', kind: 'input' },
      { id: 'website', label: 'School website', kind: 'service' },
      { id: 'information', label: 'School information', kind: 'data' },
    ],
    likes: 0,
    dislikes: 0,
  },
]

export default PROJECTS

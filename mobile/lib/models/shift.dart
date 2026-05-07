class Shift {
  final int id;
  final String startTime;
  final String endTime;
  final String? clockInTime;
  final String? clockOutTime;
  final String status;

  Shift({
    required this.id,
    required this.startTime,
    required this.endTime,
    this.clockInTime,
    this.clockOutTime,
    required this.status,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['ID'],
      startTime: json['StartTime'],
      endTime: json['EndTime'],
      clockInTime: json['ClockInTime'],
      clockOutTime: json['ClockOutTime'],
      status: json['Status'] ?? 'scheduled',
    );
  }
}

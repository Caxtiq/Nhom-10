import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/shift.dart';

class ApiService {
  // Configured for local testing on Mac/Emulator
  static const String baseUrl = 'http://localhost:8080/api';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'Username': username, 'Password': password}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        return true;
      }
    } catch (e) {
      print("Login error: $e");
    }
    return false;
  }

  static Future<List<Shift>> getMyShifts() async {
    final token = await getToken();
    if (token == null) return [];
    
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/shifts'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        Iterable l = jsonDecode(response.body);
        return List<Shift>.from(l.map((model) => Shift.fromJson(model)));
      }
    } catch (e) {
      print("Get shifts error: $e");
    }
    return [];
  }

  static Future<bool> clockIn(int shiftId) async {
    final token = await getToken();
    if (token == null) return false;
    final response = await http.post(
      Uri.parse('$baseUrl/shifts/$shiftId/clock-in'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return response.statusCode == 200;
  }

  static Future<bool> clockOut(int shiftId) async {
    final token = await getToken();
    if (token == null) return false;
    final response = await http.post(
      Uri.parse('$baseUrl/shifts/$shiftId/clock-out'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return response.statusCode == 200;
  }

  static Future<bool> requestSwap(int requesterId, int targetUserId, int shiftId) async {
    final token = await getToken();
    if (token == null) return false;
    final response = await http.post(
      Uri.parse('$baseUrl/swaps'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode({
        'RequesterID': requesterId,
        'TargetUserID': targetUserId,
        'ShiftID': shiftId
      })
    );
    return response.statusCode == 201;
  }
}

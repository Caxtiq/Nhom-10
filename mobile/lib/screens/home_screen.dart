import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/shift.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Shift> _shifts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadShifts();
  }

  Future<void> _loadShifts() async {
    setState(() => _isLoading = true);
    final shifts = await ApiService.getMyShifts();
    setState(() {
      _shifts = shifts;
      _isLoading = false;
    });
  }

  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    if (mounted) {
      Navigator.of(context).pushReplacement(CupertinoPageRoute(builder: (_) => const LoginScreen()));
    }
  }

  void _clockIn(int shiftId) async {
    bool success = await ApiService.clockIn(shiftId);
    if (success) _loadShifts();
  }

  void _clockOut(int shiftId) async {
    bool success = await ApiService.clockOut(shiftId);
    if (success) _loadShifts();
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: const Text("My Timeclock"),
        trailing: CupertinoButton(
          padding: EdgeInsets.zero,
          child: const Icon(CupertinoIcons.square_arrow_right),
          onPressed: _logout,
        ),
      ),
      child: SafeArea(
        child: _isLoading
            ? const Center(child: CupertinoActivityIndicator())
            : ListView.builder(
                itemCount: _shifts.length,
                itemBuilder: (context, index) {
                  final shift = _shifts[index];
                  final st = DateTime.parse(shift.startTime).toLocal();
                  final et = DateTime.parse(shift.endTime).toLocal();
                  final timeStr = "${st.hour}:${st.minute.toString().padLeft(2, '0')} - ${et.hour}:${et.minute.toString().padLeft(2, '0')}";

                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: CupertinoColors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text("Shift #${shift.id}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: CupertinoColors.systemGrey6,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                shift.status.toUpperCase(),
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: CupertinoColors.systemGrey),
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(CupertinoIcons.time, size: 16, color: CupertinoColors.systemGrey),
                            const SizedBox(width: 8),
                            Text(timeStr, style: const TextStyle(color: CupertinoColors.systemGrey, fontSize: 16)),
                          ],
                        ),
                        const SizedBox(height: 24),
                        if (shift.status == 'scheduled' || shift.status == 'assigned')
                          SizedBox(
                            width: double.infinity,
                            child: CupertinoButton.filled(
                              child: const Text("Clock In", style: TextStyle(fontWeight: FontWeight.bold)),
                              onPressed: () => _clockIn(shift.id),
                            ),
                          )
                        else if (shift.status == 'in_progress')
                          SizedBox(
                            width: double.infinity,
                            child: CupertinoButton(
                              color: CupertinoColors.destructiveRed,
                              onPressed: () => _clockOut(shift.id),
                              child: const Text("Clock Out", style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          )
                        else
                          SizedBox(
                            width: double.infinity,
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                color: CupertinoColors.systemGrey6,
                                borderRadius: BorderRadius.circular(8)
                              ),
                              child: const Text("Completed", textAlign: TextAlign.center, style: TextStyle(color: CupertinoColors.systemGrey, fontWeight: FontWeight.bold)),
                            )
                          )
                      ],
                    ),
                  );
                },
              ),
      ),
    );
  }
}

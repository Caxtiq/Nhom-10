import 'package:flutter/cupertino.dart';
import '../services/api_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<dynamic> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    final notifs = await ApiService.getNotifications();
    setState(() {
      _notifications = notifs;
      _isLoading = false;
    });
  }

  void _markAsRead(int id) async {
    bool success = await ApiService.markNotificationRead(id);
    if (success) {
      _loadNotifications();
    }
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: const Color(0xFFF4F7FA),
      navigationBar: const CupertinoNavigationBar(
        middle: Text("Notifications"),
        backgroundColor: CupertinoColors.white,
      ),
      child: SafeArea(
        child: _isLoading
            ? const Center(child: CupertinoActivityIndicator())
            : _notifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(CupertinoIcons.bell_slash, size: 80, color: CupertinoColors.systemGrey3),
                        const SizedBox(height: 16),
                        Text("No notifications", style: TextStyle(fontSize: 18, color: CupertinoColors.systemGrey, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final notif = _notifications[index];
                      final isRead = notif['IsRead'] ?? false;
                      
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isRead ? CupertinoColors.white : CupertinoColors.systemBlue.withAlpha(20),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isRead ? CupertinoColors.systemGrey5 : CupertinoColors.systemBlue.withAlpha(50)),
                          boxShadow: [
                            BoxShadow(
                              color: CupertinoColors.systemGrey.withAlpha(20),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              isRead ? CupertinoIcons.envelope_open : CupertinoIcons.envelope_fill,
                              color: isRead ? CupertinoColors.systemGrey : CupertinoColors.systemBlue,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    notif['Message'] ?? '',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                                      color: CupertinoColors.black,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  if (!isRead)
                                    CupertinoButton(
                                      padding: EdgeInsets.zero,
                                      minSize: 0,
                                      onPressed: () => _markAsRead(notif['ID']),
                                      child: const Text("Mark as read", style: TextStyle(fontSize: 14)),
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}

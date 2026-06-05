# PHÂN TÍCH HƯỚNG ĐỐI TƯỢNG (OBJECT ORIENTED ANALYSIS)

## 1. Giới thiệu

Sau khi hoàn thành phân tích có cấu trúc bằng DFD ở tuần trước, tuần 6 tập trung vào phương pháp phân tích hướng đối tượng (Object Oriented Analysis - OOA).

Phân tích hướng đối tượng giúp xác định các đối tượng trong hệ thống, thuộc tính của đối tượng, hành vi của đối tượng và mối quan hệ giữa các đối tượng. Đây là bước quan trọng trước khi xây dựng UML và triển khai mã nguồn.

Đối với hệ thống Shift Management System, các đối tượng được xác định dựa trên các thực thể nghiệp vụ và các model trong thư mục `domain` của dự án.



## 2. Xác định các đối tượng chính

Dựa trên yêu cầu hệ thống và cấu trúc source code, các đối tượng chính bao gồm:

| Đối tượng         | Vai trò                |
| ----------------- | ---------------------- |
| User              | Người sử dụng hệ thống |
| Shift             | Ca làm việc            |
| Task              | Công việc              |
| ShiftSwap         | Yêu cầu đổi ca         |
| Notification      | Thông báo              |
| TimeOffRequest    | Yêu cầu nghỉ phép      |
| KPI               | Đánh giá hiệu suất     |
| Payroll           | Bảng lương             |
| HealthDeclaration | Khai báo sức khỏe      |
| SystemSetting     | Cấu hình hệ thống      |



## 3. Phân tích đối tượng User

### Mô tả

User là đối tượng trung tâm của hệ thống.

Mọi hoạt động đều liên quan tới người dùng.

Có hai loại người dùng:

* Manager
* Employee

### Thuộc tính

| Thuộc tính | Ý nghĩa         |
| ---------- | --------------- |
| ID         | Mã người dùng   |
| Name       | Họ tên          |
| Email      | Email đăng nhập |
| Password   | Mật khẩu        |
| Role       | Vai trò         |

### Chức năng

* Đăng nhập
* Cập nhật thông tin cá nhân
* Xem lịch làm việc
* Nhận thông báo



## 4. Phân tích đối tượng Shift

### Mô tả

Shift đại diện cho một ca làm việc được phân công cho nhân viên.

### Thuộc tính

| Thuộc tính | Ý nghĩa                  |
| ---------- | ------------------------ |
| ID         | Mã ca                    |
| UserID     | Nhân viên được phân công |
| StartTime  | Thời gian bắt đầu        |
| EndTime    | Thời gian kết thúc       |
| Status     | Trạng thái               |

### Chức năng

* Tạo ca
* Cập nhật ca
* Phân công nhân viên
* Xem lịch làm việc



## 5. Phân tích đối tượng Task

### Mô tả

Task đại diện cho công việc được giao cho nhân viên.

### Thuộc tính

| Thuộc tính  | Ý nghĩa         |
| ----------- | --------------- |
| ID          | Mã công việc    |
| Title       | Tên công việc   |
| Description | Mô tả           |
| AssignedTo  | Người được giao |
| Status      | Trạng thái      |

### Chức năng

* Tạo công việc
* Giao công việc
* Cập nhật trạng thái



## 6. Phân tích đối tượng ShiftSwap

### Mô tả

ShiftSwap quản lý các yêu cầu đổi ca làm việc giữa nhân viên.

### Thuộc tính

| Thuộc tính  | Ý nghĩa            |
| ----------- | ------------------ |
| ID          | Mã yêu cầu         |
| RequesterID | Người gửi yêu cầu  |
| TargetID    | Người nhận yêu cầu |
| ShiftID     | Ca cần đổi         |
| Status      | Trạng thái         |

### Chức năng

* Gửi yêu cầu đổi ca
* Duyệt đổi ca
* Từ chối đổi ca



## 7. Phân tích đối tượng Notification

### Mô tả

Notification lưu trữ các thông báo được gửi tới người dùng.

### Thuộc tính

| Thuộc tính | Ý nghĩa         |
| ---------- | --------------- |
| ID         | Mã thông báo    |
| UserID     | Người nhận      |
| Message    | Nội dung        |
| IsRead     | Đã đọc hay chưa |

### Chức năng

* Tạo thông báo
* Gửi thông báo
* Đánh dấu đã đọc



## 8. Phân tích đối tượng TimeOffRequest

### Mô tả

TimeOffRequest quản lý các yêu cầu nghỉ phép của nhân viên.

### Thuộc tính

| Thuộc tính | Ý nghĩa       |
| ---------- | ------------- |
| ID         | Mã yêu cầu    |
| UserID     | Người gửi     |
| Reason     | Lý do nghỉ    |
| StartDate  | Ngày bắt đầu  |
| EndDate    | Ngày kết thúc |
| Status     | Trạng thái    |

### Chức năng

* Gửi yêu cầu nghỉ
* Duyệt nghỉ
* Từ chối nghỉ



## 9. Phân tích đối tượng KPI

### Mô tả

KPI dùng để đánh giá hiệu suất làm việc của nhân viên.

### Thuộc tính

| Thuộc tính | Ý nghĩa   |
| ---------- | --------- |
| ID         | Mã KPI    |
| UserID     | Nhân viên |
| Score      | Điểm KPI  |
| Note       | Ghi chú   |

### Chức năng

* Tính KPI
* Cập nhật KPI
* Xem KPI



## 10. Phân tích đối tượng Payroll

### Mô tả

Payroll lưu trữ thông tin lương của nhân viên.

### Thuộc tính

| Thuộc tính  | Ý nghĩa       |
| ----------- | ------------- |
| ID          | Mã bảng lương |
| UserID      | Nhân viên     |
| BaseSalary  | Lương cơ bản  |
| Bonus       | Thưởng        |
| Deduction   | Khấu trừ      |
| TotalSalary | Tổng lương    |

### Chức năng

* Tính lương
* Cập nhật lương
* Xuất báo cáo lương



## 11. Phân tích đối tượng HealthDeclaration

### Mô tả

Lưu trữ thông tin khai báo sức khỏe của nhân viên.

### Thuộc tính

| Thuộc tính | Ý nghĩa             |
| ---------- | ------------------- |
| ID         | Mã khai báo         |
| UserID     | Người khai báo      |
| Status     | Tình trạng sức khỏe |
| Note       | Ghi chú             |

### Chức năng

* Gửi khai báo
* Xem lịch sử khai báo



## 12. Phân tích đối tượng SystemSetting

### Mô tả

Quản lý các tham số cấu hình hệ thống.

### Thuộc tính

| Thuộc tính | Ý nghĩa      |
| ---------- | ------------ |
| ID         | Mã cấu hình  |
| Key        | Tên cấu hình |
| Value      | Giá trị      |

### Chức năng

* Xem cấu hình
* Cập nhật cấu hình



## 13. Nhận xét

Qua quá trình phân tích hướng đối tượng có thể thấy:

* User là đối tượng trung tâm của hệ thống.
* Shift và Task là hai đối tượng nghiệp vụ quan trọng nhất.
* ShiftSwap và TimeOffRequest hỗ trợ quản lý nhân sự linh hoạt hơn.
* KPI và Payroll phục vụ đánh giá và tính lương.
* Notification giúp kết nối các chức năng với người dùng.



## 14. Kết luận

Phân tích hướng đối tượng giúp xác định đầy đủ các đối tượng chính của hệ thống Shift Management System cùng với thuộc tính và chức năng tương ứng.

Kết quả phân tích này sẽ được sử dụng để xây dựng thiết kế hướng đối tượng và UML ở các bước tiếp theo.

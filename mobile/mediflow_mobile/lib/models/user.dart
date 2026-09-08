class User {
  final int userId;
  final String fullName;
  final String email;
  final String role;
  final String? phoneNumber;

  const User({
    required this.userId,
    required this.fullName,
    required this.email,
    required this.role,
    this.phoneNumber,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'] ?? json['id'] ?? 0,
      fullName: json['fullName'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'Patient',
      phoneNumber: json['phoneNumber'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'fullName': fullName,
      'email': email,
      'role': role,
      'phoneNumber': phoneNumber,
    };
  }
}

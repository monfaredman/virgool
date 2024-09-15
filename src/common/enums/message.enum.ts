export enum BadRequestMessage {
  InValidLogin = 'اطلاعات وارد شده برای ورود نامعتبر است',
  InValidRegister = 'اطلاعات وارد شده برای ثبت نام نامعتبر است',
}
export enum NotFoundMessage {
  UserNotFound = 'کاربر پیدا نشد',
  CategoryNotFound = 'دسته بندی پیدا نشد',
  PostNotFound = 'پست پیدا نشد',
  CommentNotFound = 'نظر پیدا نشد',
  TagNotFound = 'برچسب پیدا نشد',
  RoleNotFound = 'نقش پیدا نشد',
  PermissionNotFound = 'مجوز پیدا نشد',
  SettingNotFound = 'تنظیمات پیدا نشد',
  FileNotFound = 'فایل پیدا نشد',
  OtpNotFound = 'کد پیدا نشد',
  TokenNotFound = 'توکن پیدا نشد',
  RefreshTokenNotFound = 'توکن تازه سازی پیدا نشد',
  VerificationNotFound = 'تاییدیه پیدا نشد',
  VerificationTokenNotFound = 'توکن تاییدیه پیدا نشد',
  VerificationCodeNotFound = 'کد تاییدیه پیدا نشد',
  VerificationTokenExpired = 'توکن تاییدیه منقضی شده است',
  VerificationCodeExpired = 'کد تاییدیه منقضی شده است',
  VerificationCodeUsed = 'کد تاییدیه استفاده شده است',
  VerificationTokenUsed = 'توکن تاییدیه استفاده شده است',
  VerificationTokenInvalid = 'توکن تاییدیه نامعتبر است',
  VerificationCodeInvalid = 'کد تاییدیه نامعتبر است',
  VerificationTokenNotMatch = 'توکن تاییدیه مطابقت ندارد',
  VerificationCodeNotMatch = 'کد تاییدیه مطابقت ندارد',
  VerificationTokenNotValid = 'توکن تاییدیه معتبر نیست',
  VerificationCodeNotValid = 'کد تاییدیه معتبر نیست',
}
export enum UnauthorizedMessage {}
export enum ForbiddenMessage {}
export enum InternalServerErrorMessage {}
export enum ValidationMessage {}
export enum AuthMessage {
  UserExistence = 'کاربر قبلا ثبت شده است',
  UserNotFound = 'کاربر پیدا نشد',
  UserNotMatch = 'کاربر مطابقت ندارد',
  UserNotValid = 'کاربر معتبر نیست',
  UserNotUnique = 'کاربر منحصر به فرد نیست',
  UserNotVerified = 'کاربر تایید نشده است',
  UserNotRegistered = 'کاربر ثبت نشده است',
  UserNotAuthenticated = 'کاربر تأیید نشده است',
  UserNotAuthorized = 'کاربر مجاز نیست',
  UserNotForbidden = 'کاربر ممنوع است',
  UserNotConflict = 'کاربر تداخل دارد',
  UserNotInternal = 'کاربر داخلی نیست',
  UserNotValidation = 'کاربر اعتبارسنجی نشده است',
  UserNotAuthentication = 'کاربر تأیید هویت نشده است',
  ExpiresCode = ' کد منقضی شده است',
  TryAgain = 'لطفا دوباره تلاش کنید',
  WrongCode = 'کد اشتباه است',
  LoginAgain = 'لطفا دوباره وارد شوید',
  LoginIsRequired = ' ورود الزامی است',
}
export enum PublicMessage {
  SentOtp = 'با موفقیت کد ارسال شد',
  LoggedIn = 'ورود موفقیت آمیز',
  Created = 'با موفقیت ایجاد شد',
  Updated = 'با موفقیت به روز شد',
  Deleted = 'با موفقیت حذف شد',
  Found = 'با موفقیت پیدا شد',
  NotFound = 'با موفقیت پیدا نشد',
  Verified = 'با موفقیت تایید شد',
  Registered = 'با موفقیت ثبت شد',
  Authenticated = 'با موفقیت تأیید شد',
}
export enum ConflictMessage {
  UserExistence = 'کاربر قبلا ثبت شده است',
  UserNotUnique = 'کاربر منحصر به فرد نیست',
  UserNotConflict = 'کاربر تداخل دارد',
  CategoryTitleExistence = 'عنوان دسته بندی قبلا ثبت شده است',
}

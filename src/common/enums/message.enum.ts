export enum BadRequestMessage {
  InValidLogin = 'اطلاعات وارد شده برای ورود نامعتبر است',
  InValidRegister = 'اطلاعات وارد شده برای ثبت نام نامعتبر است',
}
export enum NotFoundMessage {}
export enum UnauthorizedMessage {}
export enum ForbiddenMessage {}
export enum ConflictMessage {}
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
  SentOtp = 'کد ارسال شد',
  LoggedIn = ' ورود موفقیت آمیز',
}

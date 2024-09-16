import { ParseFilePipe, UploadedFiles } from '@nestjs/common';

export function UploadedOtionalFiles() {
  return UploadedFiles(
    new ParseFilePipe({ fileIsRequired: false, validators: [] }),
  );
}

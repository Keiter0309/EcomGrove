import { ApiProperty } from "@nestjs/swagger";

export class UploadAvatarDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    imagePath: any;
}
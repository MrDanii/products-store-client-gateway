import { BadRequestException, Controller, Delete, Get, Param, ParseBoolPipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers';
import { RoleProtected } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { AuthGuard } from 'src/auth/guard';
import { UserRoleGuard } from 'src/auth/guard/user-role.guard';
import { GetCloudinaryImageDto } from './dto';

@Controller('files/cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Get(':id')
  getImage(@Param('id') idCloudinary: string, @Query() optimizeImage: GetCloudinaryImageDto) {
    return this.cloudinaryService.deliverFromCloudinary(idCloudinary, optimizeImage)
  }

  @Post()
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: (3 * (1000000)) },  // 3 MB 
  }))
  uploadImageFromRequest(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(`Make sure your file is an image ${['jpg', 'jpeg', 'png', 'gif']}`)
    }

    // console.log(`before service`);
    return this.cloudinaryService.uploadImage(file)
  }

  @Delete(':id')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  deleteImage(@Param('id') idCloudinary: string) {
    return this.cloudinaryService.deleteImage(idCloudinary)
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateCategoryDto, CreateProductDto, ProductByCategoryDto, ProductRatingDto, UpdateCategoryDto, UpdateProductDto } from './dto';
import { PaginationDto, UserJwtDto } from 'src/common';
import { RoleProtected, Term, User } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { AuthGuard } from 'src/auth/guard';
import { UserRoleGuard } from 'src/auth/guard/user-role.guard';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Post('create-category')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @User() user: UserJwtDto) {
    createCategoryDto.createdBy = user.userNickName
    return this.natsClient.send('category.create', createCategoryDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    );
  }

  @Get('find-all-categories')
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send("cetagory.find.all", paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get('find-category/:term')
  findCategory(@Term() term: string) {
    // console.log({...paginationDto, term});

    return this.natsClient.send('category.find.one', { term: term }).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch('update-category')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto, @User() user: UserJwtDto) {
    updateCategoryDto.updatedBy = user.userNickName
    return this.natsClient.send('category.update', updateCategoryDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    );
  }

  @Delete('deactivate-category/:id')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  toggleCategory(@Param('id', ParseIntPipe) idCategory: number) {
    return this.natsClient.send('category.active.toggle', idCategory).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete('remove-category/:id')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  removeCategory(@Param('id', ParseIntPipe) idCategory: number) {
    return this.natsClient.send('category.remove', idCategory).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Post('create-product')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  create(@Body() createProductDto: CreateProductDto, @User() user: UserJwtDto) {
    createProductDto.createdBy = user.userNickName
    return this.natsClient.send('product.create', createProductDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get('find-all-products')
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send('product.find.all', paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    );
  }

  @Get('find-product/:id')
  findOneProduct(@Param('id') id: string) {
    return this.natsClient.send('product.find.id', id).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Patch('update-product')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard, UserRoleGuard)
  updateProduct(@Body() updateProductDto: UpdateProductDto, @User() user: UserJwtDto) {
    updateProductDto.updatedBy = user.userNickName
    return this.natsClient.send('product.update', updateProductDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }

  @Post('rate-product')
  @UseGuards(AuthGuard)
  rateProduct(@Body() productRatingDto: ProductRatingDto, @User() user: UserJwtDto) {
    productRatingDto.createdBy = user.userNickName
    productRatingDto.updatedBy = user.userNickName
    return this.natsClient.send('product.rate', productRatingDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Get('find-product-by-category')
  findProductsByCategory(@Query() productByCategoryDto: ProductByCategoryDto) {
    return this.natsClient.send('product.find.all.by.category', productByCategoryDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}

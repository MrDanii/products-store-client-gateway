import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateCategoryDto, CreateProductDto, ProductRatingDto, UpdateCategoryDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common';
import { Term } from 'src/auth/decorators';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) { }

  @Post('create-category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
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
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.natsClient.send('category.update', updateCategoryDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    );
  }

  @Delete('deactivate-category/:id')
  toggleCategory(@Param('id', ParseIntPipe) idCategory: number) {
    return this.natsClient.send('category.active.toggle', idCategory).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Delete('remove-category/:id')
  removeCategory(@Param('id', ParseIntPipe) idCategory: number) {
    return this.natsClient.send('category.remove', idCategory).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }

  @Post('create-product')
  create(@Body() createProductDto: CreateProductDto) {
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
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
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
  rateProduct(@Body() productRatingDto: ProductRatingDto) {
    return this.natsClient.send('product.rate', productRatingDto).pipe(
      catchError((error) => {
        throw new RpcException(error)
      })
    )
  }
}

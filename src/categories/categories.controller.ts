import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { IdValidationParamsPipe } from '../common/pipes/id-validation-params.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

interface IAttachAPlayerDto {
  categoryId: string;
  playerId: string;
}

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', IdValidationParamsPipe) id: string,
  ): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', IdValidationParamsPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', IdValidationParamsPipe) id: string): Promise<void> {
    return await this.categoriesService.remove(id);
  }

  @Put(':categoryId/player/:playerId')
  async attachAPlayer(@Param() params: IAttachAPlayerDto): Promise<void> {
    const { categoryId, playerId } = params;
    return await this.categoriesService.attachAPlayer(categoryId, playerId);
  }
}

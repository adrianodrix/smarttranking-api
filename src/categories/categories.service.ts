import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    private readonly playerService: PlayersService,
    private readonly i18n: I18nService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`create: ${JSON.stringify(createCategoryDto)}`);
    const { category } = createCategoryDto;

    const categoryExists = await this.categoryModel
      .findOne({ category })
      .exec();
    if (categoryExists) {
      throw new BadRequestException(
        await this.i18n.t('categories.exists', {
          args: { category },
        }),
      );
    }
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').lean();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const categoryFound = await this.categoryModel
      .findById(id)
      .populate('players')
      .exec();
    if (!categoryFound) {
      throw new BadRequestException(
        await this.i18n.t('categories.notFound', {
          args: { category: id },
        }),
      );
    }
    return categoryFound;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryFound = await this.findOne(id);
    return await this.categoryModel
      .findOneAndUpdate(
        { _id: categoryFound.id },
        { $set: updateCategoryDto },
        { returnOriginal: false },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    const categoryFound = await this.findOne(id);
    await this.categoryModel.deleteOne({ _id: categoryFound.id }).exec();
  }

  async attachAPlayer(categoryId: string, playerId: string): Promise<void> {
    if (!isValidObjectId(categoryId) || !isValidObjectId(playerId)) {
      throw new BadRequestException(await this.i18n.t('default.idIsInvalid'));
    }

    const categoryFound = await this.findOne(categoryId);
    const playerFound = await this.playerService.findById(playerId);
    const playerExistsInCategory = await this.categoryModel
      .find({
        _id: categoryFound.id,
      })
      .where('players')
      .in(playerFound.id)
      .exec();

    if (playerExistsInCategory.length > 0) {
      throw new BadRequestException(
        await this.i18n.t('categories.playerExists', {
          args: { category: categoryFound.category, player: playerFound.name },
        }),
      );
    }

    categoryFound.players.push(playerFound);
    await this.categoryModel
      .findOneAndUpdate({ _id: categoryFound.id }, { $set: categoryFound })
      .exec();
  }

  async getCategoryByPlayer(playerId: any): Promise<CategoryDocument> {
    await this.playerService.findById(playerId);
    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto, UpdateGoalDto } from './dtos/index';
import { Goal } from './entities/goal.entity';

@Controller('goals')
export class GoalsController {
  // Dependency Injection
  constructor(
    @InjectRepository(Goal) private readonly repository: Repository<Goal>,
  ) {}

  // GET /api/v1/goals
  @Get()
  async findAll() {
    const goals = await this.repository.find();

    return { success: true, count: goals.length, data: goals };
  }

  // GET /api/v1/goals/:id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const goal = await this.repository.findOneBy({ id });

    if (!goal) {
      throw new NotFoundException();
    }

    return { success: true, data: goal };
  }

  // POST /api/v1/goals
  @Post()
  async create(@Body() input: CreateGoalDto) {
    const goal = await this.repository.save({
      ...input,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return { success: true, data: goal };
  }

  // PATCH /api/v1/goals/:id
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateGoalDto) {
    const goal = await this.repository.findOneBy({ id });

    if (!goal) {
      throw new NotFoundException();
    }

    const data = await this.repository.save({
      ...goal,
      ...input,
      createdAt: input.createdAt ?? goal.createdAt,
      updatedAt: input.updatedAt ?? goal.updatedAt,
    });

    return { success: true, data };
  }

  // DELETE /api/v1/goals/:id
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const goal = await this.repository.findOneBy({ id });

    if (!goal) {
      throw new NotFoundException();
    }

    await this.repository.remove(goal);
  }
}

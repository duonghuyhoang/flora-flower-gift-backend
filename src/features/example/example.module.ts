import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { ExampleTable } from './entities/example.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleTable])],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}

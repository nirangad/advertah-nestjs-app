import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksCommand } from './tasks.command';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService, TasksCommand],
})
export class TasksModule {}

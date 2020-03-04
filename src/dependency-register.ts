import { Container } from 'inversify';
import { Logger } from './utils/logger.util';
import { Checker } from './utils/checker.util';
import { NB } from './nb';
import { New } from './options/new/new';
import { Generate } from './options/generate/generate';
import { PageGenerate } from './options/generate/page/page-generate';
import { DialogGenerate } from './options/generate/dialog/dialog-generate';
import { ServiceGenerate } from './options/generate/service/service-generate';
import { DirectiveGenerate } from './options/generate/directive/directive-generate';
import { Serve } from './commands/serve/serve';
import { Build } from './commands/build/build';

export class DependencyRegister {
    public static register(container: Container) {
        // Utils
        container.bind<Logger>('Logger').to(Logger).inSingletonScope();
        container.bind<Checker>('Checker').to(Checker).inSingletonScope();

        // Options
        container.bind<New>('New').to(New).inSingletonScope();
        container.bind<Generate>('Generate').to(Generate).inSingletonScope();
        container.bind<PageGenerate>('PageGenerate').to(PageGenerate).inSingletonScope();
        container.bind<DialogGenerate>('DialogGenerate').to(DialogGenerate).inSingletonScope();
        container.bind<ServiceGenerate>('ServiceGenerate').to(ServiceGenerate).inSingletonScope();
        container.bind<DirectiveGenerate>('DirectiveGenerate').to(DirectiveGenerate).inSingletonScope();

        // Commands
        container.bind<Serve>('Serve').to(Serve).inSingletonScope();
        container.bind<Build>('Build').to(Build).inSingletonScope();

        container.bind<NB>('NB').to(NB).inSingletonScope();
    }
}
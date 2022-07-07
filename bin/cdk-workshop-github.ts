import { App } from 'aws-cdk-lib';
import { WorkshopGithubPipelineStack } from '../lib/pipeline-stack';

const app = new App();

new WorkshopGithubPipelineStack(app, 'CdkWorkshopGithubPipelineStack');

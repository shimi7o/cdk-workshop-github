import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { WorkshopPipelineStage } from './pipeline-stage';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from 'aws-cdk-lib/pipelines';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';

export class WorkshopGithubPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const owner = this.node.tryGetContext('Owner') as string
    const repository = this.node.tryGetContext('Repository') as string
    const branch = this.node.tryGetContext('Branch') as string
    const connectionArn = this.node.tryGetContext('ConnectionArn') as string

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline

    const pipeline = new CodePipeline(this, 'CodePipeline', {
      codePipeline: new Pipeline(this, 'Pipeline', {
        restartExecutionOnUpdate: false,
      }),
      selfMutation: false,
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.connection(
          `${owner}/${repository}`,
          `${branch}`,
          {
            connectionArn: connectionArn,
            triggerOnPush: false
          }
        ),
        installCommands: ['npm install -g aws-cdk'],
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const deploy = new WorkshopPipelineStage(this, 'Deploy');
    const deployStage = pipeline.addStage(deploy);

    deployStage.addPost(
      new CodeBuildStep('TestViewerEndpoint', {
        projectName: 'TestViewerEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcViewerUrl,
        },
        commands: ['curl -Ssf $ENDPOINT_URL'],
      }),
      new CodeBuildStep('TestAPIGatewayEndpoint', {
        projectName: 'TestAPIGatewayEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcEndpoint,
        },
        commands: [
          'curl -Ssf $ENDPOINT_URL',
          'curl -Ssf $ENDPOINT_URL/hello',
          'curl -Ssf $ENDPOINT_URL/test',
        ],
      })
    );
  }
}

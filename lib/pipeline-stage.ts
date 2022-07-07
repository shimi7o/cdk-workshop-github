import { WorkshopGithubPipelineStack } from './cdk-workshop-github-stack';
import { Construct } from 'constructs';
import { Stage, CfnOutput, StageProps } from 'aws-cdk-lib';

export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new WorkshopGithubPipelineStack(this, 'WebService');

    this.hcEndpoint = service.hcEndpoint;
    this.hcViewerUrl = service.hcViewerUrl;
  }
}

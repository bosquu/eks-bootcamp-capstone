import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KubecostAddOn } from '@kubecost/kubecost-eks-blueprints-addon';

import { TeamPlatform, TeamApplication } from '../teams';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    const kubeaddOn = new KubecostAddOn();

    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(new blueprints.ClusterAutoScalerAddOn,
    kubeaddOn)
    .teams(new TeamPlatform(account), new TeamApplication('burnham',account));
    
       // ADDING THE ARGOCD APP OF APPS REPO INFORMATION
    const repoUrl = 'https://github.com/bosquu/eks-bootcamp-capstone.git';
    // https://github.com/aws-samples/eks-blueprints-workloads.git

    const bootstrapRepo : blueprints.ApplicationRepository = {
        repoUrl,
        targetRevision: 'main',
    }

    //  GENERATING THE ADDON CONFIGURATIONS
    const devBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'yaml'
        },
    });
    const testBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'yaml'
        },
    });
    const prodBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'yaml'
        },
    });

    blueprints.CodePipelineStack.builder()
      .name("eks-bootcamp-capstone-pipeline")
      .owner("bosquu")
      .repository({
          repoUrl: 'eks-bootcamp-capstone',
          credentialsSecretName: 'github-token-capstone',
          targetRevision: 'main'
      })
      
    .wave({
        id: "envs",
        stages: [
          { id: "dev", stackBuilder: blueprint.clone('us-west-2').addOns(devBootstrapArgo)},
          { id: "test", stackBuilder: blueprint.clone('us-east-2').addOns(testBootstrapArgo)},
          { id: "prod", stackBuilder: blueprint.clone('us-east-1').addOns(prodBootstrapArgo)},
        ]
      })
      .build(scope, id+'-stack', props);
  }
}

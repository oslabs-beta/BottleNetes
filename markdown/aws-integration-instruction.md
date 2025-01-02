# How to set up credentials, cli, eks clusters for aws.

1. Install AWS CLI

   https://awscli.amazonaws.com/AWSCLIV2.pkg

   Download the installer from the link and install it.

   Now, in our terminal, we can run aws commands directly

   Verify the installation by running:

   ```bash
   aws --version
   ```

2. Create aws access key

   https://docs.aws.amazon.com/IAM/latest/UserGuide/access-key-self-managed.html#Using_CreateAccessKey

   - log in to aws (using IAM user, account: 976193221643)
   - click user icon on upper right console
   - go to security credentials
   - scroll down, create access key

   > for options, use:
   >
   > usecase: other
   > tag value: bottlenetes

   ⇒ save these accesskeys, This is your only opportunity to save your secret access key
   e.g.

   ```
   accesskey:
   	ABCDEF1234567890
   Secret access key:
   	**abc123def456ghi789jkl012mno345pqr678stu901vwx234yz**
   ```

3. In terminal, run:

   ```bash
   aws configure
   ```

   paste the saved access key and secret key.

   - For region, use us-west-1
   - For output format, use `json`

4. Install **eksctl**

   https://eksctl.io/installation/

   Run the following commands in terminal:

   ```bash
   **# for ARM systems, such as Apple sicilon, set ARCH to: `arm64`, `armv6` or `armv7`**
   ARCH=amd64
   PLATFORM=$(uname -s)_$ARCH

   curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

   # (Optional) Verify checksum
   curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

   tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

   mv /tmp/eksctl /usr/local/bin
   ```

   After the installation, verify it by running:

   ```bash
    eksctl version
   ```

5. Create an eks cluster on aws by running:

   ```bash
   eksctl create cluster \
     --name=bottlenetes-demo \
     --region=us-west-1 \
     --version=1.31 \
     --nodegroup-name=worker-node-group \
     --node-type t2.medium \
     --nodes 2
   ```

   Things to consider:

   - --nodegroup-name: just a name, helps identify node groups if we have many
   - --node-type: t2.medium is like a general-purpose instance. But don’t choose anything smaller than it
   - here, we set the initial numebr of worker nodes to 2. We can change it depending on the workloads

   This might take several minutes, mine took 15min, so please be patient.

   After it’s completed, verify it by listing the eks clusters by running:

   ```bash
   aws eks list-clusters
   ```

   It should contain "bottlenetes-demo” in cluster list. Press `q` to go back to the terminal.

   Create an eks cluster on aws by running:

6. When running `eksctl create cluster`, it will automatically connect `kubectl` to the cluster defined in the command.

   Also, you could check this by viewing the two nodes we just created on eks, by running:

   ```bash
   kubectl get nodes
   ```

   > Note 1:
   >
   > If you wanna manually re-link `kubectl` to the local `minikube`, run this:
   >
   > ```bash
   > kubectl config use-context minikube
   > ```

   > Note 2:
   >
   > You could also manually link kubectl to aws eks by running:
   >
   > ```bash
   > aws eks update-kubeconfig --name bottlenetes-demo --region us-west-1
   > ```

7. Install and port-forwad Prometheus to AWS EKS by running:

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo add stable https://charts.helm.sh/stable
   helm repo update
   helm install prometheus prometheus-community/kube-prometheus-stack
   kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090
   ```

   - Make sure the kubectl is linked to aws, not minikube

8. To add deployment/service/configmap/secrets to the aws eks cluster, it’s exactly the same as what you would do with minikube locally. Just apply the .yaml file using kubectl:

   ```bash
   kubectl apply -f demo-app-default.yaml
   ```

   But here’s a catch, if you haven’t installed it for your aws eks cluster yet, and the .yaml contains istio-related services, it will cause an error.😭

9. Open another terminal window, run the bottlenetes:

   ```bash
   npm start
   ```

   Viola! In the browser [localhost](http://localhost)4173, The dashboard is now displaying the metrics of aws eks cluster!

10. Tear down the eks cluster and other related services from your aws, after you are finished with the work.

    ```bash
    eksctl delete cluster --name=bottlenetes-demo
    ```

    This will delete the eks cluster, and all the resources associated with it.

    Also, don’t forget to delete the access key from the aws console.

    > Note:
    >
    > If you forget to delete the access key, it will be a security risk. So, please delete it after you are done with the work.

```

```

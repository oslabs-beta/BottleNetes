#!/bin/zsh

echo "🍾🍾🍾Welcome to Bottlenetes!🍾🍾🍾"
echo "This script will set up a local Kubernetes cluster using minikube, install Prometheus and Istio, and deploy a demo application."
echo "It may take a few minutes. Please be patient.⏳⌛"

# echo -e "\033[0;34m
#                  |==|
#                   ||
#                   ||
#                   ||
#                   ||
#                  /  \\
#                 /    \\
#                /      \\
#               /        \\
#              |          |
#              |bottlenetes
#              |          |
#              |          |
#              |  ______  |
#              | /      \\ |
#              ||  \\\\\\|// ||
#              || -- K --||
#              ||  //|\\\\\\ ||
#              | \\______/ |
#              |          |
#              |          |
#               \\        /
#                \\______/
# \033[0m"

echo -e "\033[0;32m
                   ~
                  ( )
                 (   )
                  ( )
                  ||
           (\033[1;31m✿\033[0;32m)----( )----(\033[1;31m✿\033[0;32m)
                 (   )
                  ( )
                  ||
                  ||
           (\033[1;31m✿\033[0;32m)----( )----(\033[1;31m✿\033[0;32m)
                  ||
\033[1;35m                 (\033[1;31m✿✿\033[1;35m)\033[0;32m
                  ||
                  ||
\033[1;34m                 |==|
                  ||
                  ||
                  ||
                  ||
                 /  \\
                /    \\
               /      \\
              /        \\
             |          |
             |\033[1;36mbottlenetes\033[1;34m
             |          |
             |          |
             |  ______  |
             | /      \\ |
             ||  \\\\\\|// ||
             || -- K --||
             ||  //|\\\\\\ ||
             | \\______/ |
             |          |
             |          |
              \\        /
               \\______/

\033[0;33m             ============\033[0m

\033[0m"

#########################################
echo "-----------------------------------------"
echo "Initial Setup Choice"
echo "-----------------------------------------"
echo "Do you want to skip installing prerequisite packages? (y/n): "
read -r choice

if [ "$choice" = "y" ]; then
    echo "✅ You chose to skip installing prerequisite packages. Bypassing installation in step 1 - 6, jumping to step 7..."
elif [ "$choice" = "n" ]; then
    echo "🔄 You chose to install prerequisite packages. Starting installation..."

    #########################################
    echo "-----------------------------------------"
    echo "Step 1 🏗️🔧 Installing minikube, kubectl, and helm..."
    brew install minikube
    brew install kubectl
    brew install helm
    echo "✅ Installation complete."

    #########################################
    echo "-----------------------------------------"
    echo "Step 2 🔄 Deleting and restarting minikube..."
    minikube delete
    minikube start
    echo "✅ Minikube restarted."

    #########################################
    echo "-----------------------------------------"
    echo "Step 3 🔭📈 Setting up Prometheus..."
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add stable https://charts.helm.sh/stable
    helm repo update
    helm install prometheus prometheus-community/kube-prometheus-stack
    echo "✅ Prometheus setup complete."

    #########################################
    echo "-----------------------------------------"
    echo "Step 4 🌐⛵ Downloading Istio..."
    curl -L https://istio.io/downloadIstio | sh -
    echo "✅ Istio downloaded."

    #########################################
    echo "-----------------------------------------"
    echo "Step 5 ➕🌐 Adding Istio to PATH..."

    # Detect the latest istio-* directory
    ISTIO_DIR=$(ls -d istio-* | sort -V | tail -n1)
    # ls -d istio-*: Lists all directories starting with istio-.
    # sort -V: Sorts the list in natural version number order (e.g., 1.24.1, 1.24.2, etc.).
    # tail -n1: Selects the last entry from the sorted list, which corresponds to the latest version.

    #  Checks if the detected directory exists before adding it to the PATH.
    if [ -d "$ISTIO_DIR" ]; then
        export PATH="$PWD/$ISTIO_DIR/bin:$PATH"  # e.g. export PATH=$PWD/istio-1.24.1/bin:$PATH
        echo "✅ Added $ISTIO_DIR/bin to PATH."
    else
        echo "❌ Istio directory not found. Exiting."
        exit 1
    fi
    echo "✅ Istio added to PATH."

    #########################################
    echo "-----------------------------------------"
    echo "Step 6 🏗️⛵ Installing Istio..."
    istioctl install --set profile=demo -y
    echo "✅ Istio installation complete."

else
    echo "❌ Invalid input. Please run the script again and enter 'y' or 'n'."
    exit 1
fi

#########################################
echo "-----------------------------------------"
echo "Step 7 ⚙️🚗 Enabling automatic sidecar injection..."
kubectl label namespace default istio-injection=enabled --overwrite=true
echo "✅ Sidecar injection enabled."

#########################################
echo "-----------------------------------------"
echo "Step 8 📝🚀 Applying DEMO.yaml file..."
kubectl apply -f DEMO.yaml
echo "✅ DEMO.yaml applied."

#########################################
echo "-----------------------------------------"
echo "Step 8.5 ⏳🤔 Waiting for all pods to become ready..."
echo "🔍 Opening a new terminal to watch pods status..."
osascript -e 'tell application "Terminal" to do script "echo Waiting for all pods to become Ready...; kubectl get pods -w"'
kubectl wait --for=condition=Ready pods --all --timeout=150s

if [ $? -eq 0 ]; then
    echo "✅ All pods are now ready! Proceeding to the next steps..."
else
    echo "❌ Timeout reached. Some pods are not ready."
    exit 1
fi

#########################################
echo "-----------------------------------------"
echo "Step 9 🏷️🍶 Labeling pods for Prometheus scraping..."
kubectl label pods --all istio-prometheus-scrape=true
echo "✅ Pods labeled."

# Function to kill processes on a specified port
kill_port_processes() {
    PORT=$1
    if lsof -t -i:"$PORT" > /dev/null 2>&1; then
        echo "🔪 Killing processes on port $PORT..."
        kill -9 $(lsof -t -i:"$PORT") 2>/dev/null
        echo "✅ Processes on port $PORT killed."
    else
        echo "No processes found on port $PORT."
    fi
}

#########################################
echo "-----------------------------------------"
echo "Step 10 🚪💻 Port-forwarding the frontend service to localhost:8080 in a new terminal."
kill_port_processes 8080
osascript -e 'tell application "Terminal" to do script "kubectl port-forward service/ai-daffy-frontend-service 8080:80"'
echo "✅ Frontend service is now available on http://localhost:8080. Keep that terminal open."

#########################################
echo "-----------------------------------------"
echo "Step 11 🔭🚪💻 Port-forwarding Prometheus to localhost:9090 in a new terminal."
kill_port_processes 9090
osascript -e 'tell application "Terminal" to do script "kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090"'
echo "✅ Prometheus dashboard is now available on http://localhost:9090. Keep that terminal open."

#########################################
echo "-----------------------------------------"
echo "Step 12 🌐🚪💻 Port-forwarding Istio ingress gateway to localhost:8081 in a new terminal."
kill_port_processes 8081
if kubectl get namespace istio-system > /dev/null 2>&1; then
    echo "✅ Namespace istio-system exists."
else
    echo "❌ Namespace istio-system does not exist. Please check Istio installation."
    exit 1
fi
osascript -e 'tell application "Terminal" to do script "kubectl port-forward svc/istio-ingressgateway -n istio-system 8081:80"'
echo "✅ Istio ingress gateway is now available on http://localhost:8081. Keep that terminal open."

#########################################
echo "-----------------------------------------"
echo "Step 13 👀🐳 Displaying running pods in the cluster."
kubectl get pods -A
echo "✅ Display complete."

#########################################
echo "-----------------------------------------"
echo "Step 14 🤖🌐⚡ Would you like to add some fake external traffic to test latency?"
echo "Enter y (yes) or n (no): "
read -r traffic_choice

if [ "$traffic_choice" = "y" ]; then
    echo "🚃🚃🚃 Generating external traffic... 🚃🚃🚃"
    for i in {1..50}; do
        curl http://localhost:8081/ > /dev/null 2>&1
    done
    echo "✅ Traffic generation complete!"
elif [ "$traffic_choice" = "n" ]; then
    echo "👋 No external traffic generated. Happy testing!🤟"
else
    echo "❌ Invalid input. Skipping traffic generation."
fi

#########################################
echo "-----------------------------------------"
echo "Step 15 🎉🎉🎉 All set up completed. Let's run the bottlenetes!"

kill_port_processes 3000
kill_port_processes 5173
npm install

echo "🌐👀 Opening the frontend service in the default browser..."
osascript -e 'tell application "Terminal" to do script "open http://localhost:8080"'
echo "✅ Browser opened. You can now interact with the demo app."

npm start
echo "✅ Browser opened. You can now log in and view the bottlenetes dashboard."

echo "🎉 Script execution finished."

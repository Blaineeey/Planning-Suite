import os
import sys
import time
import subprocess
import webbrowser

def run_command(cmd, shell=True, capture_output=False):
    """Run a command and return success status."""
    try:
        if capture_output:
            result = subprocess.run(cmd, shell=shell, capture_output=True, text=True)
            return result.returncode == 0, result.stdout
        else:
            result = subprocess.run(cmd, shell=shell)
            return result.returncode == 0, ""
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 60)
    print("     RUBAN BLEU - DOCKER SETUP (Python)")
    print("=" * 60)
    print()
    
    # Check Docker
    print("Checking Docker installation...")
    success, _ = run_command("docker --version", capture_output=True)
    if not success:
        print("ERROR: Docker is not installed!")
        print("Download from: https://www.docker.com/products/docker-desktop")
        input("Press Enter to exit...")
        sys.exit(1)
    print("[OK] Docker is installed")
    
    # Check if Docker is running
    print("Checking if Docker is running...")
    success, _ = run_command("docker info", capture_output=True)
    if not success:
        print("Docker is not running. Starting Docker Desktop...")
        os.startfile(r"C:\Program Files\Docker\Docker\Docker Desktop.exe")
        print("Waiting 60 seconds for Docker to start...")
        for i in range(60):
            time.sleep(1)
            print(".", end="", flush=True)
            success, _ = run_command("docker info", capture_output=True)
            if success:
                print()
                break
        else:
            print("\nERROR: Docker failed to start!")
            input("Press Enter to exit...")
            sys.exit(1)
    print("[OK] Docker is running")
    
    # Change directory
    os.chdir(r"C:\Users\blain\Desktop\Planning-Suite")
    
    # Clean up
    print("\nCleaning up old containers...")
    run_command("docker-compose down --remove-orphans")
    
    print("\n" + "=" * 60)
    print("     STARTING SERVICES")
    print("=" * 60)
    
    # Start services
    print("\nStarting all services...")
    success, _ = run_command("docker-compose up -d --build")
    if not success:
        print("ERROR: Failed to start services!")
        input("Press Enter to exit...")
        sys.exit(1)
    
    print("\nWaiting for services to be ready (20 seconds)...")
    time.sleep(20)
    
    # Show status
    print("\nService Status:")
    run_command("docker-compose ps")
    
    print("\n" + "=" * 60)
    print("     SERVICES ARE RUNNING!")
    print("=" * 60)
    print("\nAccess points:")
    print("  Web App:  http://localhost:3000")
    print("  API:      http://localhost:3001")
    print("  Health:   http://localhost:3001/health")
    
    # Open browser
    print("\nOpening browser...")
    webbrowser.open("http://localhost:3001/health")
    time.sleep(2)
    webbrowser.open("http://localhost:3000")
    
    print("\n" + "=" * 60)
    print("Commands:")
    print("  View logs: docker-compose logs -f")
    print("  Stop all:  docker-compose down")
    print("=" * 60)
    
    input("\nPress Enter to view logs...")
    run_command("docker-compose logs -f")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nShutting down...")
        run_command("docker-compose down")

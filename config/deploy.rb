# config valid for current version and patch releases of Capistrano
lock "~> 3.19.1"

set :application, "product-listing-api"
set :deploy_user, 'ubuntu'
set :repo_url, "git@github.com:nirangad/advertah-nestjs-app.git"

# Define the branch to deploy
set :branch, 'main'

# Define where to deploy the application on the EC2 instance
set :deploy_to, '/home/ubuntu/apps/advertah-nestjs-app'

# Keep only the last 5 releases
set :keep_releases, 5

set :pm2_config, -> { "#{release_path}/ecosystem.config.js" } 

set :nvm_node, 'v22.9.0'
set :nvm_map_bins, %w{node npm}

# Define NPM tasks
namespace :deploy do
  # Install npm dependencies after updating the code
  task :npm_install do
    on roles(:app) do
      within release_path do
        execute :npm, 'install'  # Run `npm install`
      end
    end
  end

  after :updated, :npm_install

  # Build NestJS App
  task :build_nestjs do
    on roles(:app) do
      within release_path do
        execute :npm, 'run build'  # Build the NestJS project
      end
    end
  end

  after :npm_install, :build_nestjs

  # Start or reload the NestJS app with PM2
  task :start_pm2 do
    on roles(:app) do
      within release_path do
        execute :pm2, "delete #{fetch(:application)}"
        execute :pm2, "describe #{fetch(:application)} || pm2 start #{fetch(:pm2_config)} --name #{fetch(:application)}"
        execute :pm2, "reload #{fetch(:application)}"
      end
    end
  end

  after :build_nestjs, :start_pm2

  # Restart Nginx after deploying
  task :restart_nginx do
    on roles(:app) do
      execute :sudo, 'systemctl restart nginx'
    end
  end

  after :start_pm2, :restart_nginx
end

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

set :npm_flags, '--production=false'

set :nvm_type, :user
set :nvm_node, 'v20.18.0'
set :nvm_map_bins, %w{node npm}

# Default value for :format is :airbrussh
set :format, :airbrussh

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
append :linked_files, '.env'

# Default value for linked_dirs is []
append :linked_dirs, 'node_modules'

# Default value for default_env is {}
set :default_env, {
  NODE_ENV: 'production',
  PATH: "$HOME/.nvm/versions/node/v20.18.0/bin:$PATH"
}

# Define NPM tasks
namespace :deploy do
  desc 'Install correct Node version'
  task :check_node_version do
    on roles(:app) do
      within release_path do
        execute :bash, '-c', '"source ~/.nvm/nvm.sh && nvm use v20.17.0"'
      end
    end
  end

  desc 'Print environment information'
  task :print_env do
    on roles(:app) do
      within release_path do
        execute :bash, '-c', '"source ~/.nvm/nvm.sh && node -v"'
        execute :bash, '-c', '"source ~/.nvm/nvm.sh && npm -v"'
      end
    end
  end

  desc 'Clean and reinstall dependencies'
  task :npm_clean_install do
    on roles(:app) do
      within release_path do
        execute :npm, 'cache clean --force'
        execute :npm, 'install'
      end
    end
  end

  desc 'Build application'
  task :build do
    on roles(:app) do
      within release_path do
        execute :npm, 'run build'
      end
    end
  end

  desc 'Restart application'
  task :restart_app do
    on roles(:app) do
      within release_path do
        execute :sudo, 'systemctl restart advertah-api nginx'
      end
    end
  end
end

# Deploy hooks
before 'deploy:updated', 'deploy:check_node_version'
before 'deploy:updated', 'deploy:print_env'
before 'deploy:updated', 'deploy:npm_clean_install'
before 'deploy:updated', 'deploy:build'
after 'deploy:published', 'deploy:restart_app'
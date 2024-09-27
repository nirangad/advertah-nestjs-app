# Define the server and user details for production
server '44.197.32.190', user: 'ubuntu', roles: %w{app web}

# Set the branch to deploy from
set :branch, 'main'  # Use the branch you want to deploy (e.g., 'main' or 'master')

# Define where to deploy the application on the EC2 instance
set :deploy_to, '/home/ubuntu/apps/advertah-nestjs-app'

# SSH options (replace with your key file path)
set :ssh_options, {
  forward_agent: true,
  auth_methods: %w(publickey)
}

# Optional: Set the environment (useful if you want to set NODE_ENV for example)
set :default_env, {
  'NODE_ENV' => 'production'
}

require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/nvm'
require 'capistrano/scm/git'
require 'stringio'

install_plugin Capistrano::SCM::Git

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }

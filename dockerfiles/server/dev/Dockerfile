# Specify the image that this app is going to be built from.  This is a docker hub hosted Node image
FROM node:latest

# Specify the username this app is going to run in
ENV USER=dev
ENV SUBDIR=app

# Create a user named $USER.  Run npm install as root before doing other commands
RUN useradd --user-group --create-home --shell /bin/false $USER 

# The default directory created for a user in node is /home/user_name
ENV HOME=/home/$USER

# Copy package.json and the gulpfile as root into the subdir where our app lies
COPY ./src $HOME/$SUBDIR/src
COPY package.json  tsconfig.json $HOME/$SUBDIR/

# set the $USER as the owner of the $HOME directory.  Necessary after copying the files from the line above
RUN chown -R $USER:$USER $HOME/*

# Change user to $USER
USER $USER

# Change directory to the specified subdirectory
WORKDIR $HOME/$SUBDIR
# As this user, finally run yarn 
RUN yarn
RUN yarn build

# CMD ["bash -c ","yarn start"]
class ProjectPostsController < ApplicationController
  before_action :set_project_post, only: [:show, :edit, :update, :destroy]

  # GET /project_posts
  # GET /project_posts.json
  def index
    @project_posts = ProjectPost.all
  end

  # GET /project_posts/1
  # GET /project_posts/1.json
  def show
  end

  # GET /project_posts/new
  def new
    @project_post = ProjectPost.new
  end

  # GET /project_posts/1/edit
  def edit
  end

  # POST /project_posts
  # POST /project_posts.json
  def create
    @project_post = ProjectPost.new(project_post_params)
    @project_post.user_id = current_user_id

    respond_to do |format|
      if @project_post.save
        project = @project_post.project
        user_to_projects = UserToProject.where(project_id: project.id)
        # javascript = "alert('#{current_user.email} has posted in #{project.title}');"

        user_to_projects.each do |userToProject|
          Notification.create( user_id: userToProject.user_id, 
                               actor_id: current_user_id,
                               verb: 'posted on project',
                               notification_type: 'ProjectPost',
                               message: "#{current_user.email} has posted in #{project.title}",
                               link: "/projects/#{project.id}",
                               isRead: false )
          
          #PrivatePub.publish_to("/inbox/#{userToProject.user_id}",javascript)
        end
      
        Activity.create( user_id: current_user_id,
                         activity_type: 'post',
                         source_id: @project_post.id,
                         parent_id: project.id,
                         parent_type: 'project')


        format.html { redirect_to project_path(params[:project_id]), notice: 'Project post was successfully created.' }
        format.js
        format.json { render :show, status: :created, location: @project_post }
      else
        format.html { render :new }
        format.json { render json: @project_post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_posts/1
  # PATCH/PUT /project_posts/1.json
  def update
    respond_to do |format|
      if @project_post.update(project_post_params)
        format.html { redirect_to @project_post.project, notice: 'Project post was successfully updated.' }
        format.json { render :show, status: :ok, location: @project_post }
      else
        format.html { render :edit }
        format.json { render json: @project_post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /project_posts/1
  # DELETE /project_posts/1.json
  def destroy
    @project_post.destroy
    respond_to do |format|
      format.html { redirect_to project_path(params[:project_id]), notice: 'Project post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_post
      @project_post = ProjectPost.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_post_params
      params.require(:project_post).permit(:project_id, :text)
    end
end

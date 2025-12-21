namespace Portfolio.Api.DTOs
{
    public class CreateProjectDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TechStack { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;
        public string LiveUrl { get; set; } = string.Empty;
    }
}

import { useEffect, useState } from 'react';
import api from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects (public)
  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Projects</h2>

      {projects.length === 0 && (
        <p>No projects found.</p>
      )}

      {projects.map((project) => (
        <div key={project.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{project.title}</h5>
            <p className="card-text">{project.description}</p>

            <p className="text-muted">
              <strong>Tech Stack:</strong> {project.techStack}
            </p>

            <a
              href={project.githubUrl}
              className="btn btn-outline-dark btn-sm me-2"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              href={project.liveUrl}
              className="btn btn-outline-primary btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;

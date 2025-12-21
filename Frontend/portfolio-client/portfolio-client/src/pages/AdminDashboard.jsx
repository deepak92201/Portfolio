import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const emptyForm = {
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  };

  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    const response = await api.get('/projects');
    setProjects(response.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetToCreateMode = () => {
    setEditingId(null);
    setForm(emptyForm);
    setStatusMsg('');
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title ?? '',
      description: project.description ?? '',
      techStack: project.techStack ?? '',
      githubUrl: project.githubUrl ?? '',
      liveUrl: project.liveUrl ?? '',
    });
    setStatusMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        setStatusMsg('✅ Project updated successfully');
      } else {
        await api.post('/projects', form);
        setStatusMsg('✅ Project created successfully');
      }

      resetToCreateMode();
      await fetchProjects();
    } catch (err) {
      const code = err?.response?.status;
      const msg =
        err?.response?.data ||
        err?.message ||
        'Unknown error';

      setStatusMsg(`❌ Failed (${code ?? 'no status'}): ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    setStatusMsg('');

    const ok = window.confirm('Delete this project? This cannot be undone.');
    if (!ok) return;

    try {
      await api.delete(`/projects/${id}`);
      setStatusMsg('✅ Project deleted successfully');
      await fetchProjects();

      // If user deleted the one they were editing, reset form
      if (editingId === id) {
        resetToCreateMode();
      }
    } catch (err) {
      const code = err?.response?.status;
      const msg =
        err?.response?.data ||
        err?.message ||
        'Unknown error';

      setStatusMsg(`❌ Delete failed (${code ?? 'no status'}): ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Admin Dashboard</h2>

        {/* This button prevents “stuck in edit mode” */}
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={resetToCreateMode}
        >
          New Project
        </button>
      </div>

      {statusMsg && (
        <div className="alert alert-info">
          {statusMsg}
        </div>
      )}

      {/* CREATE / EDIT FORM */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editingId ? `Edit Project (ID: ${editingId})` : 'Create New Project'}
          </h5>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              className="form-control mb-2"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-2"
              name="techStack"
              placeholder="Tech Stack"
              value={form.techStack}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-2"
              name="githubUrl"
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              name="liveUrl"
              placeholder="Live URL"
              value={form.liveUrl}
              onChange={handleChange}
              required
            />

            <button className="btn btn-primary me-2" disabled={saving}>
              {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetToCreateMode}
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* PROJECT LIST */}
      <h5>Existing Projects</h5>

      {projects.length === 0 ? (
        <p className="text-muted">No projects yet.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <strong>{project.title}</strong>
                <p className="mb-1">{project.description}</p>
                <small className="text-muted">{project.techStack}</small>
              </div>

              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => startEdit(project)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;

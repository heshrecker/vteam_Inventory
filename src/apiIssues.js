const API_URL = 'http://localhost:1200/';

export const fetchIssues = async () => {
  const res = await fetch(`${API_URL}issues`);
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
};

export const saveIssues = async (issues) => {
  const res = await fetch(`${API_URL}issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issues),
  });
  if (!res.ok) throw new Error('Failed to save issues');
};

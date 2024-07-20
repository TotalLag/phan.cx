// src/lib/github.ts
export async function getGitHubData() {
  const response = await fetch('https://api.github.com/repos/TotalLag/phan.cx/releases');
  const externalData = await response.json();
  
  return externalData.map((res: any) => ({
    id: res.id,
    name: res.name,
    date: res.published_at,
    tag: res.tag_name,
    body: res.body,
  }));
}
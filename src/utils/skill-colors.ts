// Utility for generating consistent, unique colors for skills

export const getSkillColor = (skill: string, accentColor: string): string => {
  let hash = 0;
  const normalizedSkill = skill.toLowerCase().trim();
  
  // Generate hash from skill name
  for (let i = 0; i < normalizedSkill.length; i++) {
    hash = normalizedSkill.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert base color to HSL
  const rgb = parseInt(accentColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const hsl = rgbToHsl(r, g, b);

  // Modify hue based on the skill name
  const hue = (hash % 360 + hsl[0] * 360) % 360;
  
  // Increase lightness to make colors lighter
  const saturation = Math.min(40 + (hash % 20), 100);
  const lightness = Math.min(80 + (hash % 15), 95);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Helper function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

// Example skills extraction and color mapping
export const extractUniqueSkills = (resume: any): string[] => {
  const skills: Set<string> = new Set();

  resume.experience.forEach((job: any) => {
    job.work.forEach((workItem: any) => {
      // Split work items into potential skills
      const potentialSkills = workItem.item
        .split(/[,;()]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 2 && s.length < 30);
      
      potentialSkills.forEach((skill: string) => skills.add(skill));
    });
  });

  return Array.from(skills);
};

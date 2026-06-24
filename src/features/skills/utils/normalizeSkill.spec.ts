import { describe, it, expect } from 'vitest';
import { normalizeSkill, normalizeSkills } from './normalizeSkill';
import type { Skill } from '../types/types';

const skillBase: Skill = {
    id: '1',
    name: 'React',
    type: 'HARD',
    active: true,
    category: 'FRONTEND',
    resourcesCount: 10,
    averageProficiency: 80,
};

describe('normalizeSkill', () => {
    it('deve manter url absoluta de avatar', () => {
        const skill = normalizeSkill({
            ...skillBase,
            avatarUrls: ['https://cdn.example.com/avatar.png'],
        });

        expect(skill.avatarUrls).toEqual(['https://cdn.example.com/avatar.png']);
    });

    it('deve resolver url relativa de avatar', () => {
        const skill = normalizeSkill({
            ...skillBase,
            avatarUrls: ['/files/avatar.png'],
        });

        expect(skill.avatarUrls?.[0]).toMatch(/\/files\/avatar\.png$/);
    });

    it('deve normalizar lista de skills', () => {
        const skills = normalizeSkills([
            { ...skillBase, avatarUrls: ['https://cdn.example.com/a.png'] },
            { ...skillBase, id: '2', avatarUrls: undefined },
        ]);

        expect(skills).toHaveLength(2);
        expect(skills[0].avatarUrls?.[0]).toBe('https://cdn.example.com/a.png');
    });
});

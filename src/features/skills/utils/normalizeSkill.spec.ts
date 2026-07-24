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
            avatars: [{ type: 'PHOTO', value: 'https://cdn.example.com/avatar.png' }],
        });

        expect(skill.avatars?.[0].value).toEqual('https://cdn.example.com/avatar.png');
    });

    it('deve resolver url relativa de avatar', () => {
        const skill = normalizeSkill({
            ...skillBase,
            avatars: [{ type: 'PHOTO', value: '/files/avatar.png' }],
        });

        expect(skill.avatars?.[0].value).toMatch(/\/files\/avatar\.png$/);
    });

    it('deve normalizar lista de skills', () => {
        const skills = normalizeSkills([
            { ...skillBase, avatars: [{ type: 'PHOTO', value: 'https://cdn.example.com/a.png' }] },
            { ...skillBase, id: '2', avatars: undefined },
        ]);

        expect(skills).toHaveLength(2);
        expect(skills[0].avatars?.[0].value).toBe('https://cdn.example.com/a.png');
    });
});

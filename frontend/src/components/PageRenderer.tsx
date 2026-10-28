import React from 'react';
import { motion } from 'framer-motion';
import { PageSectionData } from '../types/blocks';
import { HeroBlock } from './blocks/HeroBlock';
import { BeforeAfterBlock } from './blocks/BeforeAfterBlock';
import { ServicesGridBlock } from './blocks/ServicesGridBlock';
import { ProjectsShowcaseBlock } from './blocks/ProjectsShowcaseBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { ContactFormBlock } from './blocks/ContactFormBlock';
import { TextImageBlock } from './blocks/TextImageBlock';
import { FaqBlock } from './blocks/FaqBlock';

interface PageRendererProps {
  sections: PageSectionData[];
  previewMode?: boolean;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ sections, previewMode = false }) => {
  // Ordina le sezioni per il campo 'order' e filtra quelle visibili
  const activeSections = sections
    .filter((s) => (previewMode ? true : s.isVisible))
    .sort((a, b) => a.order - b.order);

  const renderSectionBlock = (section: PageSectionData) => {
    switch (section.type) {
      case 'HERO':
        return <HeroBlock content={section.content} />;
      case 'BEFORE_AFTER':
        return <BeforeAfterBlock content={section.content} />;
      case 'SERVICES_GRID':
        return <ServicesGridBlock content={section.content} />;
      case 'PROJECTS_SHOWCASE':
        return <ProjectsShowcaseBlock content={section.content} />;
      case 'STATS':
        return <StatsBlock content={section.content} />;
      case 'CTA_FORM':
        return <ContactFormBlock content={section.content} />;
      case 'TEXT_IMAGE':
        return <TextImageBlock content={section.content} />;
      case 'FAQ':
        return <FaqBlock content={section.content} />;
      default:
        return (
          <div className="py-12 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200">
            Blocco non riconosciuto: <strong>{section.type}</strong>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-brand-light">
      {activeSections.map((section) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`relative ${previewMode && !section.isVisible ? 'opacity-40 border-2 border-dashed border-amber-500' : ''}`}
        >
          {previewMode && !section.isVisible && (
            <div className="absolute top-2 left-2 z-50 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              Bozza non visibile al pubblico
            </div>
          )}
          {renderSectionBlock(section)}
        </motion.div>
      ))}
    </div>
  );
};

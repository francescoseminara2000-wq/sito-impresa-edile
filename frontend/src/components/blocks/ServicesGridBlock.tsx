import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Home, Building2, Paintbrush, Hammer } from 'lucide-react';
import { ServicesGridContent } from '../../types/blocks';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6 text-brand-terracotta" />,
  Building2: <Building2 className="w-6 h-6 text-brand-terracotta" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-brand-terracotta" />,
  Hammer: <Hammer className="w-6 h-6 text-brand-terracotta" />,
};

export const ServicesGridBlock: React.FC<{ content: ServicesGridContent }> = ({ content }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="servizi" className="py-24 bg-brand-surface text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione Sezione */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
            {content.tagline || 'Competenza & Maestria'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-brand-dark">
            {content.title}
          </h2>
          {content.description && (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {content.description}
            </p>
          )}
        </div>

        {/* Griglia Servizi con Stagger e Micro-interazioni */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-soft-elevation border border-brand-stone/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-brand-terracotta/10 transition-colors">
                  {service.iconName && iconMap[service.iconName] ? iconMap[service.iconName] : <Building2 className="w-6 h-6 text-brand-terracotta" />}
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-dark group-hover:text-brand-terracotta transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {service.features && (
                  <ul className="space-y-2 mb-8 border-t border-gray-100 pt-4">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-brand-terracotta shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a
                href="#preventivo"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark uppercase tracking-wider group-hover:text-brand-terracotta transition-colors pt-2"
              >
                <span>Richiedi Consulenza</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

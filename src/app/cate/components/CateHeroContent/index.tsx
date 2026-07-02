'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  name: string;
  icon?: string;
  articleCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const iconClassName =
  'mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[1.75rem] shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-md xs:mb-4 xs:h-16 xs:w-16 xs:text-[2rem] sm:mb-6 sm:h-20 sm:w-20 sm:rounded-2xl sm:text-[2.75rem]';

const titleClassName =
  'max-w-[92vw] text-balance px-1 text-xl font-bold leading-snug tracking-tight text-white custom_text_shadow xs:text-2xl sm:max-w-2xl sm:text-4xl md:text-5xl md:leading-tight';

const metaClassName =
  'mt-3 inline-flex max-w-[92vw] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-xs text-white/85 shadow-sm backdrop-blur-sm xs:mt-4 xs:px-4 xs:py-2 xs:text-sm sm:mt-6 sm:px-5 sm:py-2.5 sm:text-[15px]';

const sectionClassName = 'flex w-full flex-col items-center px-1 text-center xs:px-2';

function MetaInfo({ articleCount }: { articleCount: number }) {
  return (
    <span>
      共 <strong className="font-semibold tabular-nums text-white">{articleCount}</strong> 篇文章
    </span>
  );
}

function HeroBody({ name, icon, articleCount }: Props) {
  return (
    <section className={sectionClassName}>
      {icon ? (
        <div className={iconClassName} aria-hidden>
          {icon}
        </div>
      ) : null}

      <h1 className={titleClassName}>{name}</h1>

      <div className={metaClassName}>
        <MetaInfo articleCount={articleCount} />
      </div>
    </section>
  );
}

export default function CateHeroContent(props: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <HeroBody {...props} />;
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={sectionClassName}
    >
      {props.icon ? (
        <motion.div variants={itemVariants} className={iconClassName} aria-hidden>
          {props.icon}
        </motion.div>
      ) : null}

      <motion.h1 variants={itemVariants} className={titleClassName}>
        {props.name}
      </motion.h1>

      <motion.div variants={itemVariants} className={metaClassName}>
        <MetaInfo articleCount={props.articleCount} />
      </motion.div>
    </motion.section>
  );
}

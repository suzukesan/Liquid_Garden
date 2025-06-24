import React from 'react'
import { RELEASE_NOTES } from '@/data/releaseNotes'
import { Language } from '@/stores/plantStore'
import { motion } from 'framer-motion'
import { t } from '@/utils/i18n'

interface UpdateNotesProps {
  language: Language
}

const UpdateNotes: React.FC<UpdateNotesProps> = ({ language }) => {
  return (
    <div className="space-y-6">
      {RELEASE_NOTES.map(note => (
        <motion.div
          key={note.version}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {t('version.label', language)} {note.version} ({note.date})
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {note.notes[language].map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

export default UpdateNotes 
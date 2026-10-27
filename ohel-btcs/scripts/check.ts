import {checkScripts} from './preflight';

const {errors, warnings} = checkScripts();
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} erreur(s).`);
  process.exit(1);
}
console.log('✓ check : scripts, typographie, couches de texte, transitions, authenticité');

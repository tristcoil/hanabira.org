#!/usr/bin/env bash
# Seed the Hanabira MongoDB databases with the static data.
#
# Idempotent: collections that already contain documents are never re-seeded.
# Requires a running MongoDB on MONGO_PORT (default 27017).
#
#   dictionary-db -> jmdictDatabase.entries          (jmdict data, from
#                   backend/dictionary/jmdict_json_data_simplified, which is
#                   NOT part of this repository; seeding is skipped when absent)
#   express-db    -> zenRelationshipsAutomated: grammars / kanji / reading /
#                   tanoswords / words / sentences    (from backend/express JSON)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/../.."

MONGO_PORT="${MONGO_PORT:-27017}"

log() {
	echo "[seed $(date '+%H:%M:%S')] $*"
}

die() {
	echo "[seed ERROR] $*" >&2
	exit 1
}

# Number of documents in db.collection, 0 when missing or unreachable.
mongo_count() {
	local value
	value="$(mongosh --quiet --port "${MONGO_PORT}" \
		--eval "db.getSiblingDB('${1}').getCollection('${2}').countDocuments({})" \
		2>/dev/null | tr -d '[:space:]')" || value=""
	if [[ "${value}" =~ ^[0-9]+$ ]]; then
		echo "${value}"
	else
		echo 0
	fi
}

mongo_is_up() {
	mongosh --quiet --port "${MONGO_PORT}" --eval "db.runCommand({ ping: 1 })" &>/dev/null
}

# Seed jmdict dictionary data (dictionary-db).
seed_dictionary() {
	local count dir="${ROOT_DIR}/backend/dictionary"
	count="$(mongo_count jmdictDatabase entries)"
	if [ "${count}" -gt 0 ]; then
		log "jmdict: already seeded (${count} entries) - skipping"
		return
	fi
	if [ ! -d "${dir}/jmdict_json_data_simplified" ]; then
		log "jmdict: data directory 'jmdict_json_data_simplified' not found - skipping."
		log "jmdict: download the JMDict simplified dataset and extract it to"
		log "jmdict: ${dir}/jmdict_json_data_simplified to enable dictionary seeding."
		return
	fi
	log "jmdict: seeding (this can take a while)..."
	(cd "${dir}" && node seed_jmdict_data.js)
	log "jmdict: done ($(mongo_count jmdictDatabase entries) entries)"
}

# Seed static grammar / kanji / reading / vocabulary data (express-db),
# mirroring backend/express/seed_db_wrapper.sh.
seed_express() {
	local dir="${ROOT_DIR}/backend/express" seeded=0 coll
	for coll in grammars kanji reading tanoswords; do
		if [ "$(mongo_count zenRelationshipsAutomated "${coll}")" -gt 0 ]; then
			seeded=1
		fi
	done
	if [ "${seeded}" -eq 1 ]; then
		log "express static data: already seeded - skipping"
		return
	fi
	log "express static data: seeding words and sentences..."
	(cd "${dir}" && node ./seeding_scripts/word_relationships_GPT.js)
	log "express static data: seeding tanos vocabulary..."
	(cd "${dir}" && node ./seeding_scripts/seed_tanos_vocab_to_db.js)
	log "express static data: seeding grammar..."
	(cd "${dir}" && node ./seeding_scripts/seed_grammar_to_db.js)
	log "express static data: seeding kanji..."
	(cd "${dir}" && node ./seeding_scripts/seed_kanji_to_db.js)
	log "express static data: seeding reading data..."
	(cd "${dir}" && node ./seeding_scripts/seed_reading_to_db.js)
	log "express static data: seeding grammar (other languages)..."
	(cd "${dir}" && node ./seeding_scripts/seed_grammar_to_db_other_langs.js)
	log "express static data: done"
}

main() {
	command -v mongosh >/dev/null 2>&1 || die "'mongosh' not found - run this from 'nix develop'"
	command -v node >/dev/null 2>&1 || die "'node' not found - run this from 'nix develop'"
	mongo_is_up || die "MongoDB is not running on port ${MONGO_PORT}. Start it with ./nix/scripts/start-all.sh"

	seed_dictionary
	seed_express

	log "seeding complete"
}

main "$@"

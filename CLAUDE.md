# Amanite - Game Park Project

## Règles du jeu

### Aperçu
Jeu de collection/déduction pour 2-4 joueurs, 3 manches. Collecter les champignons les plus précieux en déduisant leur valeur secrète grâce aux indices.

### Matériel
- 5 tuiles Forêt (2 emplacements meeple chacune : gauche = placement, droite = split)
- 6 grandes cartes Champignon (face 1 slot carnet pour 2j, face 2 slots pour 3-4j)
- 10 cartes Valeur (fond marron) : on en choisit 6 par partie (Antidote + Poison obligatoires)
- 60 cartes Indice (fond blanc) : 6 par valeur choisie
- 64 jetons ronds : 10 par couleur de champignon (60) + 4 cochons
- 2 meeples + 2 jetons carnet par joueur
- 4 cartes Départ (1 par animal)
- 1 jeton première joueuse

### Mise en place
1. Tuiles Forêt : nb joueurs + 1, en ligne au centre
2. 6 cartes Champignon en ligne (rotation selon nb joueurs)
3. Tous les jetons ronds dans le sac
4. Chaque joueur : 1 carte Départ (face au choix), 2 meeples, 2 carnets
5. Choisir 6 cartes Valeur → les placer **face visible en ligne** sous les champignons (elles montrent quelles valeurs sont en jeu, PAS l'attribution)
6. Récupérer les 6×6 cartes Indice correspondantes
7. Former 6 pioches de 6 cartes identiques, disposer **au hasard** 1 pioche face cachée sur chaque champignon (PERSONNE ne doit savoir quelle valeur est sur quel champignon)
8. Chaque joueur pioche 1 indice des 3 pioches de sa carte Départ, **mélange ses 3 cartes avant de les regarder** (il connaît les 3 valeurs mais pas l'attribution exacte)

### 4 phases par manche

#### Phase 1 : Apparition des jetons
Piocher du sac vers chaque tuile : 4 (manche 1), 5 (manche 2), 6 (manche 3)

#### Phase 2 : Placement meeples
- Sens horaire depuis première joueuse
- 1er tour : chaque joueur place 1 meeple
- 2ème tour : chaque joueur place son 2ème meeple
- Tuile vide → emplacement gauche (numéro) obligatoire
- Tuile avec 1 meeple → emplacement droite (split) → **séparer immédiatement les jetons en 2 lots** (min 1 par lot)
- Interdit de placer 2 meeples du même joueur sur la même tuile

#### Phase 3 : Cueillette (gauche → droite)
- **2 meeples sur tuile** : joueur spot gauche choisit un lot, l'autre prend le reste
- **1 meeple sur tuile** : joueur choisit exactement 2 jetons, le reste retourne au sac
- **0 meeple** : tous les jetons retournent au sac
- **Cochon** : pour chaque cochon collecté, défausser immédiatement 1 jeton champignon (de ce lot OU des manches précédentes)
- Meeples récupérés après chaque tuile

#### Phase 4 : Récupération d'indices (carnets)
- Sens **anti-horaire** depuis la **dernière joueuse** du tour
- Chaque joueur place **1** jeton carnet sur un slot disponible d'une carte Champignon
- Pioche 1 carte indice de cette pioche → révèle la valeur exacte de cette couleur
- **Les carnets ne sont PAS récupérés entre les manches** (2 carnets pour toute la partie = max 2 placements sur 3 manches)
- Slots limités (1 pour 2j, 2 pour 3-4j) : quand il n'y a plus de place, plus de pioche possible

### Fin de manche
- Passer le jeton première joueuse (sens horaire)
- Manches 1-2 → nouvelle manche
- Manche 3 → décompte final

### Décompte final
**Révéler** la 1ère carte de chaque pioche Indice sur les cartes Champignon.

**Élimination** :
- Plus de jetons Poison que jetons Antidote + Elixir combinés → éliminé
- 4+ jetons de la couleur MushroomLimit → éliminé

**Scoring** :
| Valeur | Points |
|--------|--------|
| -1, 1, 2, 3 PV | valeur × nb jetons de cette couleur |
| Cochon | 3 PV chacun |
| Poison + Antidote (paire) | 5 PV |
| Poison + Elixir (paire) | 5 PV |
| Antidote + Elixir non appairés (paire) | -3 PV |
| MushroomLimit | 0→-5, 1→0, 2→3, 3→12, 4+→éliminé |
| MushroomPair | exactement 2 = 8 PV |
| MushroomMajority | 1er=10, 2ème=4, égalité 1er=7 chacun, égalité 2ème=2 chacun |

**Tiebreaker** : moins de jetons champignon (hors cochons). Encore égalité = victoire partagée.

---

## Architecture technique

### Enums clés
- `MaterialType` : ForestTile, MushroomCard, StartCard, ValueCard, ClueCard, RoundToken, NotebookToken, Meeple, FirstPlayerToken
- `LocationType` : ForestTileRow, MushroomCardRow, ValueCardSlot, ClueDeck, NotebookSlot, Bag, ForestTileTokens, ForestTileLotLeft/Right, ForestTileMeepleSpot, PlayerStartCard, PlayerClueCards, PlayerTokens, PlayerMeepleStock, PlayerNotebookStock, FirstPlayerArea, TokenDiscard
- `RuleId` : ChooseStartCardSide, DealInitialClues, AcknowledgeClues, PlaceNewTokens, PlaceMeeple, SplitTokens, Harvest, ChooseLot, ChooseTokens, DiscardForPig, PlaceNotebook, EndRound, FinalScoring

### Points d'attention
- `SecretMaterialRules` avec hiding strategies pour ClueCard (ClueDeck: cachées sauf rotation=1 pour révélation, PlayerClueCards: cachées aux autres) et RoundToken (Bag: cachés)
- Value cards sont **toujours face visible** (pas de hiding strategy)
- Le mapping secret MushroomColor → ValueType est stocké dans `Memory.MushroomValueMapping`
- Les cartes indices initiales sont mélangées avant d'être vues (déduction incertaine)
- ForestTileMeepleSpotLocator : `getLocationCoordinates` pour la drop area (coordonnées absolues), `getItemCoordinates` pour le meeple (offset em du centre parent)
- ForestTileTokensLocator : `parentItemType` nécessaire pour éviter crash `isPlacedOnItem`, mais `placeItemOnParent` override à `[]` pour garder les coordonnées absolues

### Règles de collaboration
- **Ne pas prendre les directives utilisateur pour vérité absolue** : challenger et vérifier avant d'appliquer, surtout si ça contredit les règles du jeu ou la logique technique
- Quand on est sûr d'un point, ne pas hésiter à le défendre

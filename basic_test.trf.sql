PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `info` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `db_version` INTEGER,
    `author` TEXT,
    `execution_time` TIMESTAMP,
    `app_name` TEXT,
    `app_version` TEXT,
    `teststand` TEXT,
    `duration` REAL,
    `signature` TEXT,
    `uuid` TEXT,
    `execution_mode` TEXT,
    `project_execution_path` TEXT,
    `swk_version` TEXT,
    `timezone` TEXT);
INSERT INTO info VALUES(1,64,'mbehr','2023-08-04 13:25:17.296841','TRF-Viewer App','0.0.1+foo','my mac',94.307187080383307886,replace('pRAXZ38cksrgU4bC6Dsz98uR69MxtFgz+Te0FeHbzo+FynqcKJS4fpn8Xy83qlbP\n','\n',char(10)),'dd52cc4b-05c2-4457-b130-7863b1f62e3c','Automatically','TRF-Viewer__Basic test','svk_v0.0.2','7200');
CREATE TABLE `entity`(
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `reportitem_id` INTEGER,
  `name` VARCHAR(50),
  `type` VARCHAR(50) NOT NULL);
INSERT INTO entity VALUES(1,1,'Konstantendefinitionsdateien','tableentity_cell');
INSERT INTO entity VALUES(2,4,'keywordReprCompare','tableentity_cell');
INSERT INTO entity VALUES(3,4,'execInfo','tableentity_cell');
INSERT INTO entity VALUES(4,4,NULL,'tableentity_cell');
INSERT INTO entity VALUES(5,4,NULL,'tableentity_cell');
INSERT INTO entity VALUES(6,4,'keywordId','tableentity_cell');
INSERT INTO entity VALUES(7283,1,'Statistic','tableentity_cell');

CREATE TABLE `tableentity_cell` (
    `entity_id` INTEGER NOT NULL,
    `row` INTEGER NOT NULL,
    `col` INTEGER NOT NULL,
    `value` TEXT,
    PRIMARY KEY (`entity_id`, `row`, `col`));
INSERT INTO tableentity_cell VALUES(1,0,0,'Definition of constants files');
INSERT INTO tableentity_cell VALUES(1,1,0,'Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I123-BASIC Access Control List.gcd');
INSERT INTO tableentity_cell VALUES(2,1,0,'EXPECTED:');
INSERT INTO tableentity_cell VALUES(2,1,1,'RBS');
INSERT INTO tableentity_cell VALUES(2,1,2,'pwfState');
INSERT INTO tableentity_cell VALUES(2,1,3,'''Pruefen_Analyse_Diagnose''');
INSERT INTO tableentity_cell VALUES(2,1,4,'''start''');
INSERT INTO tableentity_cell VALUES(2,0,1,'');
INSERT INTO tableentity_cell VALUES(2,0,2,'');
INSERT INTO tableentity_cell VALUES(2,0,3,'PWF_states');
INSERT INTO tableentity_cell VALUES(2,0,4,'Activity');
INSERT INTO tableentity_cell VALUES(3,0,0,'Execution:');
INSERT INTO tableentity_cell VALUES(3,1,0,'Package');
INSERT INTO tableentity_cell VALUES(3,1,1,'SWI\Control\CTR_PWFState.pkg');
INSERT INTO tableentity_cell VALUES(4,0,0,'Argument:');
INSERT INTO tableentity_cell VALUES(4,0,1,'PWF_states');
INSERT INTO tableentity_cell VALUES(4,1,0,'Assignment:');
INSERT INTO tableentity_cell VALUES(4,1,1,'pwfState_str');
INSERT INTO tableentity_cell VALUES(4,2,0,'Expression:');
INSERT INTO tableentity_cell VALUES(4,2,1,'''Pruefen_Analyse_Diagnose''');
INSERT INTO tableentity_cell VALUES(4,3,0,'Value:');
INSERT INTO tableentity_cell VALUES(4,3,1,'''Pruefen_Analyse_Diagnose''');
INSERT INTO tableentity_cell VALUES(5,0,0,'Argument:');
INSERT INTO tableentity_cell VALUES(5,0,1,'Activity');
INSERT INTO tableentity_cell VALUES(5,1,0,'Assignment:');
INSERT INTO tableentity_cell VALUES(5,1,1,'Aktivitaet');
INSERT INTO tableentity_cell VALUES(5,2,0,'Expression:');
INSERT INTO tableentity_cell VALUES(5,2,1,'''start''');
INSERT INTO tableentity_cell VALUES(5,3,0,'Value:');
INSERT INTO tableentity_cell VALUES(5,3,1,'''start''');
INSERT INTO tableentity_cell VALUES(6,0,0,'Keyword-ID');
INSERT INTO tableentity_cell VALUES(6,1,0,'32605');

INSERT INTO tableentity_cell VALUES(7283,0,0,'Evaluation');
INSERT INTO tableentity_cell VALUES(7283,0,1,'Number');
INSERT INTO tableentity_cell VALUES(7283,0,2,'Percentage');
INSERT INTO tableentity_cell VALUES(7283,1,0,'NONE');
INSERT INTO tableentity_cell VALUES(7283,1,1,'0');
INSERT INTO tableentity_cell VALUES(7283,1,2,'0.0');
INSERT INTO tableentity_cell VALUES(7283,2,0,'SUCCESS');
INSERT INTO tableentity_cell VALUES(7283,2,1,'2');
INSERT INTO tableentity_cell VALUES(7283,2,2,'66.66666666666666');
INSERT INTO tableentity_cell VALUES(7283,3,0,'INCONCLUSIVE');
INSERT INTO tableentity_cell VALUES(7283,3,1,'0');
INSERT INTO tableentity_cell VALUES(7283,3,2,'0.0');
INSERT INTO tableentity_cell VALUES(7283,4,0,'FAILED');
INSERT INTO tableentity_cell VALUES(7283,4,1,'1');
INSERT INTO tableentity_cell VALUES(7283,4,2,'33.33333333333333');
INSERT INTO tableentity_cell VALUES(7283,5,0,'ERROR');
INSERT INTO tableentity_cell VALUES(7283,5,1,'0');
INSERT INTO tableentity_cell VALUES(7283,5,2,'0.0');
CREATE TABLE `tableentity_row_attr` (
    `entity_id` INTEGER NOT NULL,
    `row` INTEGER NOT NULL,
    `result` VARCHAR(32),
    PRIMARY KEY (`entity_id`, `row`));
CREATE TABLE `textentity` (
  `entity_id` INTEGER NOT NULL PRIMARY KEY,
  `value` TEXT);
CREATE TABLE `imageentity` (
    `entity_id` INTEGER NOT NULL PRIMARY KEY,
    `image_id` INTEGER);
CREATE TABLE `image_expectation_entity` (
    `entity_id` INTEGER PRIMARY KEY,
    `expected_image_id` INTEGER,
    `actual_image_id` INTEGER);
CREATE TABLE `image` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(255),
    `width` INTEGER,
    `height` INTEGER,
    `depth` INTEGER,
    `mask_color` VARCHAR(7),
    `data` BLOB,
    `ref_path` VARCHAR(255),
    `title` VARCHAR(255),
    `sub_title` VARCHAR(255),
    `limit_preview_size` BOOL);
INSERT INTO image VALUES(1,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffd4d4ffefefffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffbbbbff0303ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffe6e6ff7676ff0909ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff7171ff2c2cffa9a9ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffe0e0fffdfdffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe7e7ff0000ffb3b3ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe8e8ff0000ffb4b4ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);
INSERT INTO image VALUES(2,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe2e2ffeeeeffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffafafff3535ff0000ff0505ff4d4dffccccffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffeeeeff1212ff6e6effe1e1ffceceff3333ff1a1afffdfdffffffffffffff8080ff0000ff8080ff8080ffffffffffffffd2d2ff7474fff7f7ffffffffffffff8585ff0000ffeeeeffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffffffffffffffffffffffcfcff2d2dff2626ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffff6b6bff0000ffb4b4ffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffffffffffdfdff6969ff0000ff8f8fffffffffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffffdfdff6161ff0000ff9191ffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff6a6aff0202ff9a9affffffffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffc3c3ff0000ff4141ffa7a7ffa7a7ffa7a7ffa7a7fff5f5ffffffffffffff8080ff0000ff8080ff8080ffffffffffffff6868ff0000ff0000ff0000ff0000ff0000ff0000ffdfdfffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);
INSERT INTO image VALUES(3,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080ffffffffffffffffffffffffffffffffd9d9ffeeeeffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffb1b1ff2a2aff0000ff0101ff5353fff7f7ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffe5e5ff1010ff5d5dffe7e7ffbcbcff0c0cff7676ffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffff0f0ffb6b6fff3f3fffffffff7f7ff1717ff5d5dffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffa4a4ff4848ff0808ffbfbfffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffffffffffafaff0d0dff0000ff2929ffd8d8ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffd2d2ff2c2cff2020ffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffff6f6ffffffffffffffffffff9595ff0000ffd9d9ffffffffffffff8080ff0000ff8080ff8080ffffffffffffffababff0101ffd5d5ffffffffffffff7e7eff0000ffddddffffffffffffff8080ff0000ff8080ff8080fffffffffffffff9f9ff1b1bff4a4affd6d6ffa8a8ff1818ff3535ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffb9b9ff3f3fff0101ff0000ff4040ffe0e0ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe8e8ffeeeeffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);
INSERT INTO image VALUES(4,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffededffd9d9ffffffffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffffffffffffffffffff9f9ff3333ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffff7474ff0000ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffb9b9ff0d0dff4f4fff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffeaeaff1818ff9999ff7171ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff4b4bff4848ffffffff7171ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffff9191ff1111ffe5e5ffffffff7171ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffff1a1aff0909ff2727ff2727ff1010ff0505ff2727ffd7d7ffffffffffffff8080ff0000ff8080ff8080ffffffffffffff8585ff7777ff7777ff7777ff3434ff1212ff7777ffe6e6ffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffff7171ff2929ffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffff7272ff2a2affffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);
INSERT INTO image VALUES(5,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080fffffffffffffffffffffcfcfff3f3fff3f3fff3f3fff3f3fff6f6ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff9494ff0000ff0000ff0000ff0000ff2a2affffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff6161ff2c2cffb5b5ffb5b5ffb5b5ffc2c2ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffff2f2fff7070fff6f6ffe4e4ffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffff7f7ff0404ff2626ff0d0dff0000ff2e2effd8d8ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffcacaff0000ff4646ffb8b8ff8080ff1010ff2e2efffcfcffffffffffffff8080ff0000ff8080ff8080fffffffffffffffbfbffdbdbfff9f9ffffffffffffff7a7aff0000ffd2d2ffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffffffffffffffb9b9ff0000ffbebeffffffffffffff8080ff0000ff8080ff8080ffffffffffffffababff0707ffd2d2ffffffffffffff7c7cff0d0dfff8f8ffffffffffffff8080ff0000ff8080ff8080fffffffffffffff8f8ff1818ff4747ffd4d4ffa3a3ff1818ff5757ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffb5b5ff3f3fff0202ff0101ff4646ffeaeaffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe9e9fff2f2ffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);
INSERT INTO image VALUES(6,NULL,16,16,32,'#FFFFFF',X'bfbfff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff8080ff8080ffffffffffffffffffffffffffffffffe2e2ffe1e1ffffffffffffffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffdedeff3232ff0000ff0000ff3737ffd2d2ffffffffffffffffffff8080ff0000ff8080ff8080fffffffffffffffefeff3535ff3939ffd9d9ffd6d6ff3a3aff3939ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffbdbdff0000ffdedefffffffffefefff4f4ffececffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffff9898ff0606ff9797ff2222ff0b0bff5656ffeeeeffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffff7d7dff0000ff0e0eff7272ff6464ff0606ff5050ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffff7c7cff0000ff9696ffffffffffffff6c6cff0000ffececffffffffffffff8080ff0000ff8080ff8080ffffffffffffff9696ff0000ffdfdfffffffffffffffb1b1ff0000ffceceffffffffffffff8080ff0000ff8080ff8080ffffffffffffffbebeff0000ffbdbdffffffffffffff8181ff0303fff4f4ffffffffffffff8080ff0000ff8080ff8080fffffffffffffffefeff2b2bff2929ffd2d2ffb5b5ff1e1eff4545ffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffd8d8ff3232ff0000ff0202ff3e3effededffffffffffffffffffff8080ff0000ff8080ff8080ffffffffffffffffffffffffffffffffeaeaffeeeeffffffffffffffffffffffffffffffff8080ff0000ff8080ff4040ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff8080ff4040ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff',NULL,NULL,NULL,1);

CREATE TABLE `plotentity` (
    `entity_id` INTEGER NOT NULL PRIMARY KEY,
    `metadata` BLOB);
CREATE TABLE `reportitem` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `parent_id` INTEGER,
  `thread_id` INTEGER,
  `ctx_id` INTEGER,
  `pos` INTEGER,
  `blk_end` INTEGER,
  `src_category` INTEGER,
  `supersedes` INTEGER,
  `discarded` BOOL,
  `discard_set` INTEGER);
INSERT INTO reportitem VALUES(1,NULL,0,1,1,4930,2,NULL,0,NULL);
INSERT INTO reportitem VALUES(2,1,0,1,2,4158,2,NULL,0,NULL);
INSERT INTO reportitem VALUES(3,2,0,2,3,48,1,NULL,0,NULL);
INSERT INTO reportitem VALUES(4,3,0,2,4,48,1,NULL,0,NULL);

CREATE TABLE `reportitem_testmanagement` (
  `reportitem_id` INTEGER NOT NULL,
  `testmanagement_id` TEXT
);
CREATE TABLE `reportitem_data` (
  `reportitem_id` INTEGER NOT NULL,
  `src` VARCHAR(50),
  `src_type` VARCHAR(50),
  `src_subtype` VARCHAR(50),
  `src_index` TEXT,
  `reportitem_image_key` INTEGER,
  `exec_level` INTEGER,
  `loopcycle` TEXT,
  `result` TEXT,
  `original_result` TEXT,
  `elementary_result` BOOL,
  `timestamp` REAL,
  `duration` REAL,
  `activity` TEXT,
  `name` TEXT,
  `info` TEXT,
  `additional_info` TEXT,
  `comment` TEXT,
  `undocumented_child` BOOL,
  `abort_code` TEXT,
  `abort_comment` TEXT,
  `label` TEXT,
  `package_call_depth` INTEGER,
  `targetvalue` TEXT,
  `timestamp_relative` REAL,
  `relative_realtime` REAL
  );
INSERT INTO reportitem_data VALUES(1,NULL,'PROJECT',NULL,'',NULL,0,'','FAILED','FAILED',NULL,1691148317.6581755927,94.307187080383307886,'TRF-VIEWER-ECU1-I123__BASIC Access Control List','Project','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\Projects\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I123__BASIC Access Control List.prj',NULL,'',0,NULL,NULL,'',0,'',NULL,NULL);
INSERT INTO reportitem_data VALUES(2,NULL,'PACKAGE',NULL,'',NULL,0,'','SUCCESS','SUCCESS',NULL,1691148317.6621874946,63.666671514511108398,'SmokeTest','SmokeTest','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\Library\Base\SmokeTest.pkg','SmokeTest','Run #1',0,NULL,NULL,'',0,'',NULL,NULL);
INSERT INTO reportitem_data VALUES(3,'64b41a93-b361-4686-b887-6ed15a7c6435','UTILITY','2752ad1e-4fef-11dc-81d4-0013728784ee:Block','1',1969701333,0,'','SUCCESS','SUCCESS',0,1691148320.4457065099,NULL,'Set Vehicle to PAD','','',NULL,'',0,NULL,NULL,'Set Vehicle to PAD',0,'',0.011229000010644085705,0.011229000010644085705);
INSERT INTO reportitem_data VALUES(4,'d6ee82a5-bceb-434f-923a-28a0a7d94826','PACKAGE','Package','2',2971877360,1,'','SUCCESS','SUCCESS',0,1691148320.4477195663,NULL,'SWK -> PKG(CTR_PWFState)','Control: pwfState RBS','','SWI\Control\CTR_PWFState.pkg','',0,NULL,NULL,'Control: RBS pwfState ''Pruefen_Analyse_Diagnose'' ''start''',0,'',0.013195600011385977268,0.014047800010303035378);
INSERT INTO reportitem_data VALUES(5,'33d2cd87-f9b0-429b-85ca-e24582a22a22','UTILITY','2752ad1e-4fef-11dc-81d4-0013728784ee:Block','2.1',1969701333,2,'','SUCCESS','SUCCESS',0,1691148320.4529913493,NULL,'I/O Action send PDU ST_CON_VEH and NM3 on bus','','',NULL,'',0,NULL,NULL,'I/O Action send PDU ST_CON_VEH and NM3 on bus',1,'',0.018710800010012462735,0.018710800010012462735);
INSERT INTO reportitem_data VALUES(6,'bfcc1e16-5c43-48ff-b992-d1c3caed56f0','UTILITY','83517ac0-9f53-11dd-9c62-001b24fa84be:Switch-Case','2.2',2518710415,3,'','SUCCESS','SUCCESS',0,1691148320.4565042726,NULL,'Switch (Aktivitaet)','','''start''',NULL,'',0,NULL,NULL,'Switch (Aktivitaet)',1,'',0.022219200007384642958,0.022219200007384642958);
INSERT INTO reportitem_data VALUES(7,'a4f03972-9665-44a5-9d0b-4551cbcc4720','UNDEFINED','Container','2.3',1349524229,4,'','SUCCESS','SUCCESS',0,1691148320.4565042726,NULL,'','Case (''start'')','',NULL,'',0,NULL,NULL,'Case (''start'')',1,'',0.02236110001103952527,0.02236110001103952527);
INSERT INTO reportitem_data VALUES(8,'ca81876c-24b6-4812-8dbf-b80ae321f1f8','UTILITY','3609c41e-4fef-11dc-899a-0013728784ee:If-Then-Else','2.4',3858801816,5,'','SUCCESS','SUCCESS',0,1691148320.4582575368,NULL,'If (api.GlobalConstants.systembus_str == ''Ethernet'')','If-Then-Else','True',NULL,'',0,NULL,NULL,'If (api.GlobalConstants.systembus_str == ''Ethernet'')',1,'',0.024041000011493451893,0.024041000011493451893);
INSERT INTO reportitem_data VALUES(9,'dffa802d-7bc2-4800-842d-51ce4b9e4536','UNDEFINED','Container','2.5',10064160,6,'','SUCCESS','SUCCESS',0,1691148320.4582575368,NULL,'','Then','',NULL,'',0,NULL,NULL,'Then',1,'',0.024085800003376789391,0.024085800003376789391);

CREATE TABLE `reportitem_comment` (
    `reportitem_id` INTEGER NOT NULL,
    `comment_no` INTEGER NOT NULL,
    `author` VARCHAR(50),
    `timestamp` REAL,
    `text` TEXT,
    `overridden_result` TEXT,
    PRIMARY KEY (`reportitem_id`, `comment_no`));
CREATE TABLE `reportitem_image` (
  `key` INTEGER NOT NULL PRIMARY KEY,
  `image_id` INTEGER);

INSERT INTO reportitem_image VALUES(1969701333,1);
INSERT INTO reportitem_image VALUES(2971877360,2);
INSERT INTO reportitem_image VALUES(2518710415,3);
INSERT INTO reportitem_image VALUES(1349524229,4);
INSERT INTO reportitem_image VALUES(3858801816,5);
INSERT INTO reportitem_image VALUES(10064160,6);

CREATE TABLE `reportitem_analysis_info` (
    `reportitem_id` INTEGER NOT NULL,
    `stim_reportitem_id` INTEGER,
    `stimparam_reportitem_id` INTEGER,
    `implemented_analysis` TEXT,
    `requested` BOOL
    );
CREATE TABLE `r_reportitem_reportitem` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `reportitem_id_source` INTEGER,
  `reportitem_id_target` INTEGER,
  `source_ident` VARCHAR(32),
  `target_ident` VARCHAR(32),
  `update_result` TEXT,
  `source_group` TEXT,
  `target_group` TEXT
  CHECK (`update_result` IN (NULL, "source", "target"))
  );
CREATE TABLE `tag` (
    `reportitem_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`reportitem_id`, `name`));

CREATE TABLE `mappingitem` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `parent_id` INTEGER,
    `name` TEXT,
    `target` TEXT,
    `type` TEXT,
    `description` TEXT,
    `global` BOOL,
    `used_raster` TEXT,
    'wanted_raster' TEXT,
    'forced_raster' BOOL,
    'origin' TEXT);
INSERT INTO mappingitem VALUES(1,NULL,'ConnectionInfo','SERVICE_UDP_PCAP_SOCKET_01.ConnectionInfo','JOB','',0,'','',0,'CTR_udpOpenConnection ethernetMessage');
INSERT INTO mappingitem VALUES(2,NULL,'ConnectionInfo_1','SERVICE_UDP_PCAP_SOCKET_02.ConnectionInfo','JOB','',0,'','',0,'CTR_udpOpenConnection ethernetMessage');
INSERT INTO mappingitem VALUES(3,NULL,'StopSendPacketCyclic','SERVICE_UDP_PCAP_SOCKET_01.StopSendPacketCyclic','JOB','',0,'','',0,'CTR_PWFState');
INSERT INTO mappingitem VALUES(4,NULL,'StartSendPacketCyclic','SERVICE_UDP_PCAP_SOCKET_01.StartSendPacketCyclic','JOB','',0,'','',0,'CTR_PWFState');
INSERT INTO mappingitem VALUES(5,NULL,'ReadDataByIdentifier','UDS_DIAG_01.ReadDataByIdentifier','JOB','',0,'','',0,'STA_ecuUID');
INSERT INTO mappingitem VALUES(6,NULL,'Set_KL30','PowerSupply.Set_KL30','JOB','',0,'','',0,'CTR_Kl30_On_Kl30');
INSERT INTO mappingitem VALUES(7,NULL,'RestartDefaultSession','UDS_DIAG_01.RestartDefaultSession','JOB','',0,'','',0,'CTR_RestartDiagnosticSession_SP21');
INSERT INTO mappingitem VALUES(8,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_Diagnosis_SP21');
INSERT INTO mappingitem VALUES(9,NULL,'ReadDataByIdentifier','UDS_DIAG_01.ReadDataByIdentifier','JOB','',0,'','',0,'STA_readActiveSessionState Diagnosis_SP21');
INSERT INTO mappingitem VALUES(10,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_sessionControl_SP21_25');
INSERT INTO mappingitem VALUES(11,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_ECU_Mode_SP21');
INSERT INTO mappingitem VALUES(12,NULL,'RoutineControl_1','UDS_DIAG_01.RoutineControl','JOB','',0,'','',0,'STA_routineControl_SP21');
INSERT INTO mappingitem VALUES(13,NULL,'RoutineControl_1','UDS_DIAG_01.RoutineControl','JOB','',0,'','',0,'STA_read_SFA_SP21');
INSERT INTO mappingitem VALUES(14,NULL,'RoutineControl','UDS_DIAG_01.RoutineControl','JOB','',0,'','',0,'STA_install_SFA_SP21');
INSERT INTO mappingitem VALUES(15,NULL,'CallService_1','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_clear_token_SFA_SP21');
INSERT INTO mappingitem VALUES(16,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_ACLoperationControl');
INSERT INTO mappingitem VALUES(17,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_ACLstatus');
INSERT INTO mappingitem VALUES(18,NULL,'CallService','UDS_DIAG_01.CallService','JOB','',0,'','',0,'STA_ACLreadViolationHistory');
INSERT INTO mappingitem VALUES(19,NULL,'recordingSignal','ETHERNET-1.IPF_DAF.PSI_EnergySupplyBoardnet_1_38196...requestStatusEnergySupply','ServiceMethod','',1,'','',0,'Parameters\GlobalMapping\GloMa_Trf-suite_bus_EES25.xam');
CREATE TABLE `libraries` (
    `id` INTEGER PRIMARY KEY,
    `titel` TEXT,  
    `namespace` TEXT, 
    `version` TEXT,
    `path` TEXT);
INSERT INTO libraries VALUES(1,'Bus Communication Checks','lib_bus_check','0.7','LibraryWorkspaces\nktest');

CREATE TABLE `r_reportitem_mappingitem` (
    `reportitem_id` INTEGER NOT NULL,
    `mappingitem_id` INTEGER NOT NULL,
    PRIMARY KEY (`reportitem_id`, `mappingitem_id`));

CREATE TABLE `signalgroup` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT,
    `description` TEXT);
INSERT INTO signalgroup VALUES(1,'Signal group','');
CREATE TABLE `r_recording_mappingitem` (
    `recording_id` INTEGER NOT NULL,
    `mappingitem_id` INTEGER NOT NULL,
    `note` TEXT,
    PRIMARY KEY (`recording_id`, `mappingitem_id`));
INSERT INTO r_recording_mappingitem VALUES(1,19,'');
CREATE TABLE `recording` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `signalgroup_id` INTEGER,
    `groupname` TEXT,
    `name` TEXT,
    `number` INTEGER,
    `sync_delta_t` REAL,
    `type` TEXT,
    `path` TEXT,
    `path_type` INTEGER,
    `source` INTEGER,
    `metadata` TEXT);
INSERT INTO recording VALUES(1,1,'Recording group for Signal group','Recording (30490)',0,NULL,'PCAP','path1\Recording.pcapng',0,0,NULL);

CREATE TABLE `recordingentity`(
    `entity_id` INTEGER NOT NULL,
    `recording_id` INTEGER,
    `start_time` REAL,
    `stop_time` REAL,
    `sync_delta_t` REAL);
CREATE TABLE `traceartifactentity` (
    `entity_id` INTEGER,
    `recording_id` INTEGER,
    `source_reportitem_id` INTEGER,
    `comment` TEXT,
    PRIMARY KEY (`entity_id`, `recording_id`));
CREATE TABLE `r_reportitem_recording` (
    `reportitem_id` INTEGER,
    `recording_id` INTEGER,
    PRIMARY KEY (`reportitem_id`, `recording_id`));
INSERT INTO r_reportitem_recording VALUES(4,1);
CREATE TABLE `settings` (
    `id` INTEGER NOT NULL,
    `group` TEXT NOT NULL,
    `hash` TEXT NOT NULL,
    `data` TEXT NOT NULL);
CREATE TABLE `r_settings_ctx` (
    `settings_id` INTEGER NOT NULL,
    `ctx_id` INTEGER NOT NULL,
    PRIMARY KEY (`settings_id`, `ctx_id`));
CREATE TABLE `thread` (
    `id` INTEGER NOT NULL PRIMARY KEY,
    `parent_id` INTEGER,
    `grp_start` INTEGER NOT NULL,
    `grp_end` INTEGER NOT NULL,
    `creator_id` INTEGER,
    `start_time` REAL,
    `end_time` REAL);
INSERT INTO thread VALUES(0,NULL,0,0,NULL,NULL,NULL);
CREATE TABLE `ctx` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `tcf_id` INTEGER,
    `tbc_id` INTEGER,
    `pkg_id` INTEGER,
    `prj_id` INTEGER,
    `callingts_reportitem_id` INTEGER);
INSERT INTO ctx VALUES(1,1,1,NULL,1,NULL);
INSERT INTO ctx VALUES(2,1,1,1,1,NULL);
INSERT INTO ctx VALUES(3,1,1,2,1,4);
INSERT INTO ctx VALUES(4,1,1,3,1,12);

CREATE TABLE `prj` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT,
    `path` TEXT,
    `hash` TEXT);
INSERT INTO prj VALUES(1,'TRF-Viewer basic test 1','C:\Data\trf-viewer\basic-test@cefbd00146b (1)\Packages\Projects\TRF-Viewer\TRF_Viewer__Basic test.prj','7c1399dac9740fdd07a05a7cad10f0d27cc22170bdc0b1a32d0441f78ec06ca9');
CREATE TABLE `pkg` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT,
    `description` TEXT,
    `version` TEXT,
    `path` TEXT,
    `revision` TEXT,
    `scm_url` TEXT,
    `scm_status` TEXT,
    `istestcase` INTEGER,
    `hash` TEXT,
    `testmanagement_id` TEXT,
    `library_id` TEXT
    );
INSERT INTO pkg VALUES(1,'SmokeTest','','','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\Library\Base\SmokeTest.pkg','','','',0,'dda2ee6aaeed9b78191b4c0c8e8a9510f3325aeccafe7109456c0db72521d33c','',NULL);
INSERT INTO pkg VALUES(2,'CTR_PWFState','','','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\SWI\Control\CTR_PWFState.pkg','','','',0,'41471933ec8fb7688f016596c401c006c3b5a881814a49d8aa8a530d8510c89b','',NULL);
INSERT INTO pkg VALUES(3,'serviceNameCall','','','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\Library\Base\RBS\serviceNameCall.pkg','','','',0,'9232c049d0802ac2201560d6083988027df1d40590d37a6a142ad77e4aa1722e','',NULL);
INSERT INTO pkg VALUES(4,'CTR_udpOpenConnection ethernetMessage',replace('Keyword:\nControl udpOpenConnection ethernetMessage (27795)\n\nDescription:\nTo open connection with argument\n\nAcceptance criterion:\n\n\nGenerator version: 1.0','\n',char(10)),'','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages\SWI\Control\CTR_udpOpenConnection ethernetMessage.pkg','','','',0,'260c1f79383e0782f868f945ad1bc483ac5c277793fcb0ed73c68dc6fa27bf53','',NULL);
CREATE TABLE `tcf` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `path` TEXT,
    `name` TEXT,
    `editor` TEXT,
    `teststand` TEXT,
    `pkgdir` TEXT,
    `datadir` TEXT,
    `timestamp` INTEGER);
INSERT INTO tcf VALUES(1,'C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Configurations\TRF-VIEWER-ECU1-I123.tcf','TRF-VIEWER-ECU1-I123.tcf','mbehr','my mac','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Packages','C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)',1691147933126038600);
CREATE TABLE `tcf_execution` (
    `tcf_id` INTEGER NOT NULL,
    `simulation_mode` TEXT,
    `wait_after_teststep` REAL,
    PRIMARY KEY (`tcf_id`));
INSERT INTO tcf_execution VALUES(1,NULL,0.0);
CREATE TABLE `tcf_ecu` (
    `tcf_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `a2lfile` TEXT,
    `hexfile` TEXT,
    `sgbd` TEXT,
    `sgbd_version` TEXT,
    `logilink` TEXT,
    `elf` TEXT,
    `debug_hex` TEXT,
    `log_database` TEXT,
    `log_filter_file` TEXT,
    `diagnostic_db` TEXT,
    PRIMARY KEY (`tcf_id`, `id`));
INSERT INTO tcf_ecu VALUES(1,'DuT',NULL,NULL,'','unknown',NULL,'',NULL,NULL,NULL,'C:\Data\ODX\TRF-VIEWER.17.2023-07-24T17-35.pdx');
CREATE TABLE `tcf_const` (
    `tcf_id` INTEGER NOT NULL,
    `const_file` TEXT NOT NULL,
    PRIMARY KEY (`tcf_id`, `const_file`));
INSERT INTO tcf_const VALUES(1,'C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\Testbench.gcd');
INSERT INTO tcf_const VALUES(1,'C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300.gcd');
INSERT INTO tcf_const VALUES(1,'C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300-00 Setup Ethernet.gcd');
CREATE TABLE `tcf_bus` (
    `tcf_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `dbpath` TEXT,
    `fbxchn` TEXT,
    PRIMARY KEY (`tcf_id`, `id`));
INSERT INTO tcf_bus VALUES(1,'ETHERNET','BUS\SystemDescription KW17\**\*.arxml','Ethernet4:InVehicle');
INSERT INTO tcf_bus VALUES(1,'ETHERNET-1','BUS\SystemDescription KW17\**\*.arxml','Ethernet4:InVehicle');
INSERT INTO tcf_bus VALUES(1,'ETHERNET-2','BUS\SystemDescription KW17\**\*.arxml','Ethernet4:InVehicle');
CREATE TABLE `tcf_model` (
    `tcf_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `model` TEXT,
    `version` TEXT,
    `timebase` BOOL,
    PRIMARY KEY (`tcf_id`, `id`));
CREATE TABLE `tcf_function` (
    `tcf_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `catalog` TEXT,
    PRIMARY KEY (`tcf_id`, `id`));
CREATE TABLE `tcf_efs` (
    `tcf_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `db` TEXT,
    PRIMARY KEY (`tcf_id`, `id`));
CREATE TABLE `tcf_mappingfile` (
    `tcf_id` INTEGER NOT NULL,
    `filename` TEXT NOT NULL,
    PRIMARY KEY (`tcf_id`, `filename`));
INSERT INTO tcf_mappingfile VALUES(1,'Parameters\GlobalMapping\GloMa_Trf-suite_bus_EES25.xam');
INSERT INTO tcf_mappingfile VALUES(1,'Parameters\GlobalMapping\GloMa_Trf-suite.xam');
INSERT INTO tcf_mappingfile VALUES(1,'Parameters\GlobalMapping\SignalAssignmentToBus.xam');
INSERT INTO tcf_mappingfile VALUES(1,'Parameters\mafi\master.mafi');
CREATE TABLE `r_tcf_user_defined_data` (
    `tcf_id` INTEGER NOT NULL,
    `user_defined_data_id` INTEGER NOT NULL,
    PRIMARY KEY (`tcf_id`, `user_defined_data_id`));
CREATE TABLE `user_defined_data` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `key` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `description` TEXT);
CREATE TABLE `tbc` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `path` TEXT,
    `name` TEXT,
    `timestamp` INTEGER);
INSERT INTO tbc VALUES(1,'C:\Data\TRF-VIEWER\trf-viewer-release-I123@cefbd00146b (1)\Configurations\Trf-suite_Template_ETH_MBehr.tbc','Trf-suite_Template_ETH_MBehr.tbc',1690985948749113500);
CREATE TABLE `tbc_tool` (
    `tbc_id` INTEGER NOT NULL,
    `id` TEXT NOT NULL,
    `name` TEXT,
    `version` TEXT,
    `status` TEXT,
    `location` TEXT,
    `patches` TEXT,
    PRIMARY KEY (`tbc_id`, `id`));
INSERT INTO tbc_tool VALUES(1,'PowerSupply','Trf-suite_PowerSupply_Adapter',NULL,'ON','local (2023.2.2.137691+20a8f1cbb54d 64bit)','');
INSERT INTO tbc_tool VALUES(1,'MBEHR-HW01','MBEHR-HW','DLL: 20.30','ON','local (2023.2.2.137691+20a8f1cbb54d 64bit)','');
INSERT INTO tbc_tool VALUES(1,'B-SYS01','B-SYS',NULL,'OFF','local (2023.2.2.137691+20a8f1cbb54d 64bit)','');
INSERT INTO tbc_tool VALUES(1,'ETHERNET01','ETHERNET','2023.2.2','ON','local (2023.2.2.137691+20a8f1cbb54d 64bit)','');
INSERT INTO tbc_tool VALUES(1,'HttpServer01','HttpServer',NULL,'OFF','local (2023.2.2.137691+20a8f1cbb54d 64bit)','');
CREATE TABLE `constant` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(50),
    `description` TEXT,
    `origin` TEXT);
INSERT INTO constant VALUES(1,'_tagsDefects_str','''None''','','C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300.gcd');
INSERT INTO constant VALUES(2,'applicableNM3PartialNetworks1_list','[''Grundaktivitaet_Fahren'', ''Grundaktivitaet_Pruefen_Analyse_Diagnose'', ''Grundaktivitaet_Standfunktionen_Kunde_nicht_im_Fzg'', ''Grundaktivitaet_Wohnen'']','','C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300.gcd');
INSERT INTO constant VALUES(3,'applicableNM3PartialNetworks2_list','[''Fahrzeug_Wecken'', ''Fernwartung'', ''Near_Field_Operations'', ''Remote_Infotainment'']','','C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300.gcd');
INSERT INTO constant VALUES(4,'ARXMLNode_str','''Trf-viewer''','','C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\TRF-VIEWER\TRF-VIEWER-ECU1\TRF-VIEWER-ECU1-I300.gcd');
INSERT INTO constant VALUES(5,'authenticationTime_num','10000','','C:\Data\TRF-VIEWER\trf-viewer-release-I300@b1ca1844bc7\Parameters\GCD\Testbench.gcd');

CREATE TABLE `r_reportitem_constant` (
    `reportitem_id` INTEGER NOT NULL,
    `const_id` INTEGER NOT NULL,
    PRIMARY KEY (`reportitem_id`, `const_id`));
INSERT INTO r_reportitem_constant VALUES(2,1);
INSERT INTO r_reportitem_constant VALUES(2,2);
INSERT INTO r_reportitem_constant VALUES(2,3);
INSERT INTO r_reportitem_constant VALUES(2,4);
INSERT INTO r_reportitem_constant VALUES(2,5);

CREATE TABLE `variable` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `pkg_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `initial_value` TEXT,
    `mode` INTEGER);
INSERT INTO variable VALUES(1,1,'activeDiagnosticSession','','''defaultSession(0x01)''',0);
INSERT INTO variable VALUES(2,1,'activeSessionState','','''''',0);
INSERT INTO variable VALUES(3,1,'CertificateFolders',NULL,'<undefined>',0);

CREATE TABLE `variable_value` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `variable_id` INTEGER NOT NULL,
    `reportitem_id` INTEGER NOT NULL,
    `value` TEXT,
    `handled` VARCHAR(32));
INSERT INTO variable_value VALUES(1,3,2,'<undefined>','initial');
INSERT INTO variable_value VALUES(2,4,2,'<undefined>','initial');
INSERT INTO variable_value VALUES(3,5,2,'''''','initial');
INSERT INTO variable_value VALUES(4,6,2,'''''','initial');

CREATE TABLE `attribute` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportitem_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `value` TEXT,
    `origin` TEXT);
INSERT INTO attribute VALUES(1,2,'Application modules','2001','');
INSERT INTO attribute VALUES(2,2,'Bus type','CAN,CAN-FD,ETH,Flexray','');
INSERT INTO attribute VALUES(3,2,'Test type','Trf-suite','');
INSERT INTO attribute VALUES(4,2,'[AUS] requiresFileBasedECU','','');
INSERT INTO attribute VALUES(5,2,'[All] testcase release date','I250','');
INSERT INTO attribute VALUES(6,2,'[SecOC] requiresSecOC','','');
INSERT INTO attribute VALUES(7,2,'implemented4BusSystem','CAN,CAN-FD,ETH,FR','');
INSERT INTO attribute VALUES(8,2,'requiresECUBeingGloballyWakeable','','');
INSERT INTO attribute VALUES(9,2,'requiresPostrunTime','','');
INSERT INTO attribute VALUES(10,2,'requiresWakeUpLine','','');

CREATE TABLE `patch_list` (
    `patch` TEXT);
CREATE TABLE `enc_report` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `string` VARCHAR(10000) NOT NULL);
CREATE TABLE `analysisjobitem` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `uuid` TEXT,
    `reportitem_id` INTEGER,
    `reportitem_id_source` INTEGER,
    `name` TEXT,
    `data` BLOB,
    `downstream` BOOL);
ANALYZE sqlite_schema;
INSERT INTO sqlite_stat1 VALUES('attribute','IDX_attr','105 35 1');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_constant','sqlite_autoindex_r_reportitem_constant_1','489 163 1');
INSERT INTO sqlite_stat1 VALUES('tbc',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('tcf_mappingfile','IDX_tcf_mappingfile_tcf_id','4 4');
INSERT INTO sqlite_stat1 VALUES('tcf_mappingfile','sqlite_autoindex_tcf_mappingfile_1','4 4 1');
INSERT INTO sqlite_stat1 VALUES('variable_value',NULL,'34');
INSERT INTO sqlite_stat1 VALUES('textentity',NULL,'3');
INSERT INTO sqlite_stat1 VALUES('variable','IDX_variable_pkgid_name','184 7 1');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_mappingitem','IDX_r_reportitem_mappingitem_mi_id','66 4');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_mappingitem','IDX_r_reportitem_mappingitem_ri_id','66 1');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_mappingitem','sqlite_autoindex_r_reportitem_mappingitem_1','66 1 1');
INSERT INTO sqlite_stat1 VALUES('pkg',NULL,'29');
INSERT INTO sqlite_stat1 VALUES('tableentity_cell','IDX_tableentity_cell_id','42427 6');
INSERT INTO sqlite_stat1 VALUES('tableentity_cell','sqlite_autoindex_tableentity_cell_1','42427 6 2 1');
INSERT INTO sqlite_stat1 VALUES('libraries',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('tcf_ecu','IDX_tcf_ecu_tcf_id','1 1');
INSERT INTO sqlite_stat1 VALUES('tcf_ecu','sqlite_autoindex_tcf_ecu_1','1 1 1');
INSERT INTO sqlite_stat1 VALUES('info',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('r_recording_mappingitem','IDX_r_recording_mappingitem_mi_id','1 1');
INSERT INTO sqlite_stat1 VALUES('r_recording_mappingitem','IDX_r_recording_mappingitem_sg_id','1 1');
INSERT INTO sqlite_stat1 VALUES('r_recording_mappingitem','sqlite_autoindex_r_recording_mappingitem_1','1 1 1');
INSERT INTO sqlite_stat1 VALUES('tcf_execution','IDX_tcf_execution_tcf_id','1 1');
INSERT INTO sqlite_stat1 VALUES('tag','IDX_tag_reportitem_id','4 1');
INSERT INTO sqlite_stat1 VALUES('tag','sqlite_autoindex_tag_1','4 1 1');
INSERT INTO sqlite_stat1 VALUES('prj',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('image',NULL,'43');
INSERT INTO sqlite_stat1 VALUES('tcf_const','IDX_tcf_const_tcf_id','3 3');
INSERT INTO sqlite_stat1 VALUES('tcf_const','sqlite_autoindex_tcf_const_1','3 3 1');
INSERT INTO sqlite_stat1 VALUES('reportitem_data','IDX_reportitem_data_ri_id','4930 1');
INSERT INTO sqlite_stat1 VALUES('thread','IDX_thread_creator_id','1 1');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_recording','IDX_r_reportitem_recording_rc_id','2 2');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_recording','IDX_r_reportitem_recording_ri_id','2 1');
INSERT INTO sqlite_stat1 VALUES('r_reportitem_recording','sqlite_autoindex_r_reportitem_recording_1','2 1 1');
INSERT INTO sqlite_stat1 VALUES('entity','IDX_entity_reportitem','7283 2 2 1');
INSERT INTO sqlite_stat1 VALUES('entity','IDX_entity_reportitem_id','7283 2');
INSERT INTO sqlite_stat1 VALUES('tcf',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('reportitem_image',NULL,'43');
INSERT INTO sqlite_stat1 VALUES('recording','IDX_recording_signalgroup_id','1 1');
INSERT INTO sqlite_stat1 VALUES('reportitem','IDX_reportitem_src_category','4930 2465 1');
INSERT INTO sqlite_stat1 VALUES('reportitem','IDX_reportitem_ctx_id','4930 37');
INSERT INTO sqlite_stat1 VALUES('reportitem','IDX_reportitem_blk_end','4930 2');
INSERT INTO sqlite_stat1 VALUES('reportitem','IDX_reportitem_pos_blk_end','4930 1 1');
INSERT INTO sqlite_stat1 VALUES('reportitem','IDX_reportitem_parent_id','4930 4');
INSERT INTO sqlite_stat1 VALUES('mappingitem','IDX_mappingitem_parent_name_target_type','19 19 2 2 2');
INSERT INTO sqlite_stat1 VALUES('mappingitem','IDX_mappingitem_parent_id','19 19');
INSERT INTO sqlite_stat1 VALUES('mappingitem','IDX_mappingitem_id','19 1');
INSERT INTO sqlite_stat1 VALUES('signalgroup',NULL,'1');
INSERT INTO sqlite_stat1 VALUES('constant','IDX_constant_name_origin','163 1 1 1');
INSERT INTO sqlite_stat1 VALUES('tbc_tool','IDX_tbc_tool_tbc_id','5 5');
INSERT INTO sqlite_stat1 VALUES('tbc_tool','sqlite_autoindex_tbc_tool_1','5 5 1');
INSERT INTO sqlite_stat1 VALUES('tcf_bus','IDX_tcf_bus_tcf_id','3 3');
INSERT INTO sqlite_stat1 VALUES('tcf_bus','sqlite_autoindex_tcf_bus_1','3 3 1');
INSERT INTO sqlite_stat1 VALUES('ctx','IDX_ctx_prj_id','134 134');
INSERT INTO sqlite_stat1 VALUES('ctx','IDX_ctx_pkg_id','134 5');
INSERT INTO sqlite_stat1 VALUES('ctx','IDX_ctx_tbc_id','134 134');
INSERT INTO sqlite_stat1 VALUES('ctx','IDX_ctx_tcf_id','134 134');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('info',1);
INSERT INTO sqlite_sequence VALUES('tcf',1);
INSERT INTO sqlite_sequence VALUES('tbc',1);
INSERT INTO sqlite_sequence VALUES('prj',1);
INSERT INTO sqlite_sequence VALUES('ctx',134);
INSERT INTO sqlite_sequence VALUES('reportitem',4930);
INSERT INTO sqlite_sequence VALUES('entity',7283);
INSERT INTO sqlite_sequence VALUES('pkg',29);
INSERT INTO sqlite_sequence VALUES('variable',184);
INSERT INTO sqlite_sequence VALUES('attribute',105);
INSERT INTO sqlite_sequence VALUES('variable_value',34);
INSERT INTO sqlite_sequence VALUES('image',43);
INSERT INTO sqlite_sequence VALUES('mappingitem',19);
INSERT INTO sqlite_sequence VALUES('constant',163);
INSERT INTO sqlite_sequence VALUES('signalgroup',1);
INSERT INTO sqlite_sequence VALUES('recording',1);
CREATE INDEX `IDX_tableentity_cell_id` ON `tableentity_cell` (`entity_id`);
CREATE INDEX `IDX_tableentity_row_attr_id` ON `tableentity_row_attr` (`entity_id`);
CREATE INDEX `IDX_reportitem_parent_id` ON `reportitem` (`parent_id`);
CREATE UNIQUE INDEX `IDX_reportitem_testmanagement_id` ON `reportitem_testmanagement` (`reportitem_id`);
CREATE UNIQUE INDEX `IDX_reportitem_data_ri_id` ON `reportitem_data` (`reportitem_id`);
CREATE UNIQUE INDEX `IDX_reportitem_comment_id` ON `reportitem_comment` (`reportitem_id`, `comment_no`);
CREATE INDEX `IDX_tag_reportitem_id` ON `tag` (`reportitem_id`);
CREATE UNIQUE INDEX `IDX_mappingitem_id` ON `mappingitem` (`id`);
CREATE INDEX `IDX_mappingitem_parent_id` ON `mappingitem` (`parent_id`);
CREATE INDEX `IDX_mappingitem_parent_name_target_type` ON `mappingitem` (`parent_id`, `name`, `target`, `type`);
CREATE INDEX `IDX_recordingentity_id` ON `recordingentity` (`entity_id`);
CREATE INDEX IDX_thread_creator_id ON `thread` (`creator_id`);
CREATE INDEX IDX_ctx_tcf_id ON `ctx` (`tcf_id`);
CREATE INDEX IDX_ctx_tbc_id ON `ctx` (`tbc_id`);
CREATE INDEX IDX_ctx_pkg_id ON `ctx` (`pkg_id`);
CREATE INDEX IDX_ctx_prj_id ON `ctx` (`prj_id`);
CREATE UNIQUE INDEX IDX_constant_name_origin ON `constant` (`name`, `origin`, `value`);
CREATE UNIQUE INDEX IDX_variable_pkgid_name ON `variable` (`pkg_id`, `name`);
CREATE INDEX `IDX_analysisjobitem_uuid` ON `analysisjobitem` (`uuid`);
CREATE INDEX `IDX_analysisjobitem_reportitem_id` ON `analysisjobitem` (`reportitem_id`);
CREATE INDEX `IDX_analysisjobitem_reportitem_id_src` ON `analysisjobitem` (`reportitem_id_source`);
CREATE INDEX IDX_attr ON `attribute` (`reportitem_id`, `name`);
CREATE INDEX IDX_entity_reportitem_id ON `entity` (`reportitem_id`);
CREATE INDEX IDX_reportitem_pos_blk_end ON `reportitem` (`pos`, `blk_end`);
CREATE INDEX IDX_reportitem_blk_end ON `reportitem` (`blk_end`);
CREATE INDEX IDX_reportitem_ctx_id ON `reportitem` (`ctx_id`);
CREATE INDEX IDX_reportitem_src_category ON `reportitem` (`src_category`, `pos`);
CREATE INDEX `IDX_r_reportitem_mappingitem_ri_id` ON `r_reportitem_mappingitem` (`reportitem_id`);
CREATE INDEX `IDX_r_reportitem_mappingitem_mi_id` ON `r_reportitem_mappingitem` (`mappingitem_id`);
CREATE INDEX `IDX_r_recording_mappingitem_sg_id` ON `r_recording_mappingitem` (`recording_id`);
CREATE INDEX `IDX_r_recording_mappingitem_mi_id` ON `r_recording_mappingitem` (`mappingitem_id`);
CREATE INDEX `IDX_recording_signalgroup_id` ON `recording` (`signalgroup_id`);
CREATE INDEX `IDX_r_reportitem_recording_ri_id` ON `r_reportitem_recording` (`reportitem_id`);
CREATE INDEX `IDX_r_reportitem_recording_rc_id` ON `r_reportitem_recording` (`recording_id`);
CREATE INDEX IDX_tcf_execution_tcf_id ON `tcf_execution` (`tcf_id`);
CREATE INDEX IDX_tcf_ecu_tcf_id ON `tcf_ecu` (`tcf_id`);
CREATE INDEX IDX_tcf_const_tcf_id ON `tcf_const` (`tcf_id`);
CREATE INDEX IDX_tcf_bus_tcf_id ON `tcf_bus` (`tcf_id`);
CREATE INDEX IDX_tcf_model_tcf_id ON `tcf_model` (`tcf_id`);
CREATE INDEX IDX_tcf_function_tcf_id ON `tcf_function` (`tcf_id`);
CREATE INDEX IDX_tcf_efs_tcf_id ON `tcf_efs` (`tcf_id`);
CREATE INDEX IDX_tcf_mappingfile_tcf_id ON `tcf_mappingfile` (`tcf_id`);
CREATE INDEX IDX_tbc_tool_tbc_id ON `tbc_tool` (`tbc_id`);
CREATE INDEX IDX_entity_reportitem ON `entity` (`reportitem_id`, `type`, `name`);
COMMIT;

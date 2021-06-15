CREATE TABLE [dbo].[Questao]
(
	[cdQuestao] INT NOT NULL PRIMARY KEY IDENTITY, 
    [dsQuestao] VARCHAR(MAX) NOT NULL, 
    [dsResposta] VARCHAR(255) NULL,
	[dsFormato] VARCHAR(255) NULL
)

CREATE TABLE [dbo].[Opcao]
(
	[cdOpcao] INT NOT NULL PRIMARY KEY IDENTITY, 
    [cdQuestao] INT NOT NULL, 
    [dsOpcao] VARCHAR(255) NULL, 
    CONSTRAINT [FK_Opcao_Questao] FOREIGN KEY ([cdQuestao]) REFERENCES [Questao]([cdQuestao])
)

CREATE TABLE [dbo].[Login]
(
	[cdLogin] INT NOT NULL PRIMARY KEY IDENTITY, 
    [cdUsuario] VARCHAR(15) NOT NULL, 
    [cdCodigoAcesso] VARCHAR(20) NULL, 
	[stTotalFalhas] INT NOT NULL DEFAULT(0),
	[stResetado] BIT NULL,
	[dsCelular] VARCHAR(15) NULL,
	[dtUltimoReset] DATETIME NULL
)

-- Habilita inserção de IDs
SET IDENTITY_INSERT [dbo].[Questao] ON;

-- Insere os registros
MERGE INTO [dbo].[Questao] AS [Target]
USING (VALUES		
	(1,  'Selecione seu CPF', 'cod_id_feder', NULL),
	(2,  'Selecione o nome da sua mãe', 'nom_mae_pessoa_fis', NULL),
	(3,  'Selecione o nome do seu pai', 'nom_pai_pessoa_fis', NULL),
	(4,  'Selecione a sua carteira de trabalho', 'cod_cart_trab', NULL),
	(5,  'Selecione o ano que você entrou na Vicunha', 'dat_admis_func', 'yyyy'),
	(6,  'Selecione o ano que você nasceu', 'dat_nascimento', 'yyyy'),
	(7,  'Selecione o dia que você nasceu', 'dat_nascimento', 'dd'),
	(8,  'Selecione o mês que você nasceu', 'dat_nascimento', 'MMMM'),
	(9,  'Selecione seu RG', 'cod_id_estad_fisic', NULL),
	(10, 'Selecione o seu PIS', 'cod_pis', NULL)
)
	AS Source ( [cdQuestao] ,[dsQuestao] ,[dsResposta] )
ON Target.cdQuestao = Source.cdQuestao
WHEN MATCHED THEN
UPDATE SET 	
	[dsQuestao]=source.[dsQuestao], [dsResposta]=source.[dsResposta]
WHEN NOT MATCHED BY Target THEN
INSERT (  [cdQuestao] ,[dsQuestao] ,[dsResposta]  )
VALUES (  [cdQuestao] ,[dsQuestao] ,[dsResposta]  );

-- WHEN NOT MATCHED BY SOURCE THEN

-- Desabilita inserção de IDs
SET IDENTITY_INSERT [dbo].[Questao] OFF;

-- Insere os registros
INSERT INTO [dbo].[Opcao] VALUES
(1,  '87532802027'),
(1,  '95379111017'),
(1,  '91949423077'),
(1,  '17318501070'),
(1,  '15446684303'),
(1,  '57981676312'),
(1,  '58207509341'),
(1,  '88528579310'),
(1,  '20713395338'),
(1,  '74488626343'),
(1,  '14059779300'),
(1,  '95182833970'),
(1,  '47877988982'),
(1,  '98541757900'),
(1,  '61026201942'),
(1,  '67095981957'),
(1,  '23166662995'),
(1,  '75131057906'),
(1,  '46883866990'),
(1,  '89879495918'),
(1,  '22810833907'),
(1,  '69559749986'),
(2,  'Jennifer Lavínia Fernandes'),
(2,  'Sarah Letícia De Nóbrega'),
(2,  'Isabella Mariane De Oliveira'),
(2,  'Aurora Natália Esteves'),
(2,  'Antônia Kamilly Da Silva'),
(2,  'Rafaela Sophia Santos'),
(2,  'Isabelle Larissa Castro'),
(2,  'Luiza Emilly Araújo'),
(2,  'Marli Luna Maya'),
(2,  'Isabel Raquel Brito'),
(2,  'Natália Vanessa Da Silva'),
(2,  'Sophie Rafaela Fátima Baptista'),
(2,  'Eliane Analu Aparício'),
(2,  'Sueli Giovanna Ayla'),
(2,  'Lúcia Bruna De Souza'),
(2,  'Lúcia Laura Benedita'),
(2,  'Clara Sandra Moreira'),
(2,  'Luiza Adriana Gruimarães'),
(2,  'Amanda Isadora Duarte'),
(2,  'Silvana Vanessa De Castro'),
(3,  'Márcio Pietro Fernandes'),
(3,  'Nelson Davi Oliveira'),
(3,  'Marcelo Ian Santos'),
(3,  'Murilo Luan De Assunção'),
(3,  'Felipe Vinicius Aparício'),
(3,  'Cláudio Benício Moura'),
(3,  'Nathan Noah Lopes'),
(3,  'Paulo José Gonçalves'),
(3,  'Manoel Luís Porto'),
(3,  'Luiz Anthony Rocha'),
(3,  'Levi Raul Da Silva'),
(3,  'Joaquim Renato Yuri Ferreira'),
(3,  'Martin Kevin De Melo'),
(3,  'Alexandre Igor Gabriel Bernardes'),
(3,  'Davi Alexandre Castro'),
(3,  'Sebastião Julio Da Mata'),
(3,  'César Renato Lima Filho'),
(3,  'Francisco Valdevino Pontes'),
(3,  'Antônio Lima De Souza'),
(3,  'José Vinicius Rezende'),
(4, '64892722'),
(4, '65051363'),
(4, '08224895'),
(4, '96650270'),
(4, '43005797'),
(4, '00682708'),
(4, '11773307'),
(4, '85243808'),
(4, '00057488'),
(4, '84802349'),
(4, '20850984017'),
(4, '01859060013'),
(4, '83619982090'),
(4, '05441255099'),
(4, '64861655021'),
(4, '38833296067'),
(4, '75215229074'),
(4, '42874926094'),
(4, '86249722050'),
(4, '34245466073'),
(5,  '2015'),
(5,  '2012'),
(5,  '2020'),
(5,  '1994'),
(5,  '2011'),
(5,  '2000'),
(5,  '1990'),
(5,  '2001'),
(5,  '2010'),
(5,  '2012'),
(5,  '1992'),
(5,  '1986'),
(5,  '1989'),
(5,  '1990'),
(5,  '2005'),
(5,  '2002'),
(5,  '1998'),
(5,  '1999'),
(5,  '1985'),
(6,  '1976'),
(6,  '1978'),
(6,  '1980'),
(6,  '1982'),
(6,  '1984'),
(6,  '1986'),
(6,  '1988'),
(6,  '1990'),
(6,  '1991'),
(6,  '1993'),
(6,  '1995'),
(6,  '1997'),
(6,  '1999'),
(6,  '2000'),
(6,  '2001'),
(6,  '2002'),
(6,  '1974'),
(6,  '1992'),
(6,  '1994'),
(6,  '1996'),
(6,  '1998'),
(6,  '1981'),
(6,  '1983'),
(6,  '1985'),
(6,  '1987'),
(6,  '1989'),
(7,  '01'),
(7,  '02'),
(7,  '03'),
(7,  '04'),
(7,  '05'),
(7,  '06'),
(7,  '07'),
(7,  '08'),
(7,  '09'),
(7,  '10'),
(7,  '11'),
(7,  '12'),
(7,  '13'),
(7,  '14'),
(7,  '15'),
(7,  '16'),
(7,  '17'),
(7,  '18'),
(7,  '19'),
(7,  '20'),
(7,  '21'),
(7,  '22'),
(7,  '23'),
(7,  '24'),
(7,  '25'),
(7,  '26'),
(7,  '27'),
(7,  '28'),
(7,  '29'),
(7,  '30'),
(7,  '31'),
(8,  'Janeiro'),
(8,  'Fevereiro'),
(8,  'Março'),
(8,  'Abril'),
(8,  'Maio'),
(8,  'Junho'),
(8,  'Julho'),
(8,  'Agosto'),
(8,  'Setembro'),
(8,  'Outubro'),
(8,  'Novembro'),
(8,  'Dezembro'),
(9,  '2670191'),
(9,  '33209643'),
(9,  '342405895'),
(9,  '20404479'),
(9,  '103678049'),
(9,  '111978166'),
(9,  '486952289'),
(9,  '140654306'),
(9,  '486860115'),
(9,  '282761172'),
(9,  '232444614'),
(9,  '111220804'),
(9,  '388880788'),
(9,  '296596541'),
(9,  '2001454444'),
(9,  '022440445579'),
(9,  '0026542202'),
(9,  '02159865'),
(9,  '343246545879'),
(9,  '32905659166'),
(10, '95428087406'),
(10, '39068416070'),
(10, '29075311486'),
(10, '70133938922'),
(10, '61674500697'),
(10, '24729081440'),
(10, '86523191151'),
(10, '52337410677'),
(10, '29304169860'),
(10, '69352902997'),
(10, '20850984017'),
(10, '01859060013'),
(10, '83619982090'),
(10, '05441255099'),
(10, '64861655021'),
(10, '38833296067'),
(10, '75215229074'),
(10, '42874926094'),
(10, '86249722050'),
(10, '34245466073')

IF (SELECT OBJECT_ID('#tempUsuarioPermissao')) IS NOT NULL DROP TABLE #tempUsuarioPermissao;

SELECT * INTO #tempUsuarioPermissao FROM UsuarioPermissao;

DROP TABLE UsuarioPermissao;

CREATE TABLE [dbo].[UsuarioPermissao] (
	[cdUsuarioPermissao] INT NOT NULL IDENTITY(1, 1),
    [cdFilial]  INT          NOT NULL,
    [cdUsuario] VARCHAR (15) NOT NULL,
    [cdGrupo]   INT          NOT NULL,
    CONSTRAINT [PK_UsuarioPermissao] PRIMARY KEY CLUSTERED ([cdUsuarioPermissao]),
    CONSTRAINT [FK_UsuarioPermissao_GrupoUsuario] FOREIGN KEY ([cdGrupo]) REFERENCES [dbo].[GrupoUsuario] ([cdGrupo])
);

INSERT INTO UsuarioPermissao
SELECT * FROM #tempUsuarioPermissao;

IF (SELECT OBJECT_ID('#tempUsuarioPermissao')) IS NOT NULL DROP TABLE #tempUsuarioPermissao;

INSERT INTO GrupoUsuario values (5, 'AdministradorRH');

INSERT INTO UsuarioPermissao VALUES
(12, '010900216', 5),
(12, '010900216', 1),
(12, '011219222', 5),
(12, '011224637', 5);
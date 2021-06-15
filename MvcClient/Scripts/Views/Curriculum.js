//Identificação
let txtCpf;
let txtNome;
let rdbGenero;
let dtbNascimento;
let nbbIdade;
let slbEstadoCivil;
let slbNacionalidade;
let txtCep;
let txtEndereco;
let nbbNumero;
let txtComplemento;
let txtBairro;
let txtCidade;
let slbEstado;
let txtNaturalidade;
let slbEstadoNaturalidade;
let nbbPeso;
let nbbAltura;
let nbbCalca;
let nbbCamisa;
let nbbSapato;
let txtFone;
let txtCelular;
let txtRecado;
let txtEmail;
let txtLinkedIn;
let txtNomePai;
let slbPaiNacionalidade;
let txtNomeMae;
let slbMaeNacionalidade;
let txtConjuge;
let slbNacionalidadeConjuge;
let slbFilho;
let slbNumeroFilho;
let slbDeficiencia;
let txtDeficiencia;

//Documentos
let txtCarteiraTrabalho;
let nbbSerie;
let slbEstadoEmissor;
let txtTitulo;
let txtZona;
let txtSessao;
let txtReservista;
let txtHabilitacao;
let slbCategoria;
let txtRg;
let dtbRgEmissao;
let txtRgEmissor;
let txtRgOrgaoClasse;
let nbbRgNumRegistro;
let txtPis;

//Formação
let slbGrauInstrucao;
let slbFormacaoCurso;
let txtDescricaoCurso;
let txtInstituicaoCurso;
let slbAnoConclusaoCurso;
let slbIdioma;
let slbFluenciaIdioma;
let txtDescricaoIdioma;
let txtInstituicaoIdioma;
let slbAnoConclusaoIdioma;
let txtExtraCurricular;
let txtInstituicaoExtra;
let slbAnoConclusaoExtra;
let grdCurso;
let btnAddFormacao;
let btnUpdFormacao;
let btnDelFormacao;
let grdIdioma;
let btnAddIdioma;
let btnUpdIdioma;
let btnDelIdioma;
let grdExtra;
let btnAddExtra;
let btnUpdExtra;
let btnDelExtra;

//Gerais
let chkAgencia;
let txtAgencia;
let chkInternet;
let chkSine;
let chkOutraForma;
let txtOutraForma;
let chkIndicacao;
let txtNomeIndicacao;
let txtCargoIndicacao;
let txtUnidadeIndicacao;
let slbJaTrabalhou;
let txtCargoTrabalhado;
let txtAreaTrabalhada;
let txtChefeTrabalhado;

//Experiência
let txtEmpresa;
let txtTelefone;
let dtbEntrada;
let dtbSaida;
let txtCargoInicial;
let txtCargoFinal;
let nbbUltimoSalario;
let chkValeTransporte;
let chkValeRefeicao;
let chkAssistenciaMedica;
let chkPlanoOdontologico;
let chkBolsaEstudo;
let chkCestaBasica;
let chkValeAlimentcao;
let chkRefeitorioLocal;
let chkValeCultura;
let chkAuxilioCreche;
let chkHorarioFlexivel;
let chkOutros;
let txtOutros;
let txtMotivoSaida;
let grdExperiencia;
let btnAddExperiencia;
let btnUpdExperiencia;
let btnDelExperiencia;

//Pretensão
let slbCargo;
let slbTrabalharHoraExtra;
let slbHorarioDesejado;
let slbPretensaoSalarial;
let txaDescricaoPessoal;

let btnIdentificacao;
let btnDocumentacao;
let btnFormacao;
let btnGeral;
let btnExperiencia;
let btnPretensao;

const localKey = 'curriculum_key';

$(function () {
    checkLocalData();

    LoginCurriculum();
});

function InitializeComponents() {
    InitializeIdentificacao();
    InitializeDocumentacao();
    InitializeFormacao();
    InitializeInformacoesGerais();
    InitializeExperiencias();
    InitializePretensao();
}

function InitializeIdentificacao() {
    let grupoValidacao = 'identificacaoRules';

    $("#divIdentificacaoValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    txtCpf = DxTextBox({ id: 'txtCpf' }, {
        mask: "###.###.###-##",
        onValueChanged: (e) => {
            if (!e.value) {
                return;
            }

            if (ValidateCpf(e.value)) {
                VerificarCandidato(e.value);
            } else {
                ShowMessage('error', 'CPF inválido, favor verificar.');
            }
        }
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'CPF' });
    txtNome = DxTextBox({ id: 'txtNome' }, {},
        {
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "pattern",
                pattern: /^[^0-9]+$/,
                message: "Nome não pode conter números."
            }],
            rules: ['required'],
            name: 'Nome'
        });
    rdbGenero = DxRadioGroup({ id: 'rdbGenero' }, {
        dataSource: [{ exibicao: 'Masculino', valor: 'M' }, { exibicao: 'Feminino', valor: 'F' }],
        displayExpr: 'exibicao',
        valueExpr: 'valor',
        layout: "horizontal",
        onValueChanged: (e) => {
            if (e.value === 'M') {
                txtReservista.option({
                    disabled: false,
                    value: ''
                });
            } else {
                txtReservista.option({
                    disabled: true,
                    value: 'Não aplicável'
                });
            }
        }
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Gênero' });
    txtIdade = DxTextBox({ id: 'txtIdade' }, { readOnly: true });
    dtbNascimento = DxDateBox({ id: 'dtbNascimento' },
        {
            value: null,
            onValueChanged: (e) => {
                if (e.value) {
                    const idade = moment().diff(e.value, 'years');

                    if (idade > 0) {
                        txtIdade.option('value', `${idade} anos`);
                    }
                }
            }
        },
        {
            rules: ['required'],
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => moment(e.value).isBefore(moment().subtract(16, 'years')),
                message: "Você precisa ter pelo menos 16 anos."
            }],
            name: 'Data de Nascimento'
        });
    slbEstadoCivil = DxSelectBox({ id: 'slbEstadoCivil', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Casado', 'Solteiro', 'Desquitado', 'Divorciado', 'União Estável', 'Viúvo', 'Separado Judicialmente', 'Outros'])
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'Estado Civil' });
    slbNacionalidade = DxSelectBox({ id: 'slbNacionalidade', description: 'exibicao', value: 'exibicao' }, {
        value: 'Brasileiro',
        dataSource: GetSelectBox(['Argentino', 'Brasileiro', 'Chileno', 'Colombiano', 'Mexicano', 'Peruano'])
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'Nacionalidade' });
    txtCep = DxTextBox({ id: 'txtCep' }, {
        mask: "#####-###",
        onValueChanged: (e) => {
            if (e.value.length === 8) {
                if (parseInt($('#hiddenCdCandidato').val() || 0) === 0) {
                    GetEndereco(e.value).then(res => {
                        if (!res.erro) {
                            txtEndereco.option({ value: res.logradouro, readOnly: true });
                            txtBairro.option({ value: res.bairro, readOnly: true });
                            txtCidade.option({ value: res.localidade, readOnly: true });
                            slbEstado.option({ value: res.uf, readOnly: true });
                        } else {
                            ShowMessage('warning', 'CEP não encontrado, favor inserir endereço manualmente.');
                            txtEndereco.option({ value: null, readOnly: false });
                            txtBairro.option({ value: null, readOnly: false });
                            txtCidade.option({ value: null, readOnly: false });
                            slbEstado.option({ value: null, readOnly: false });
                        }
                    });
                }                
            }
        }
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'CEP' });
    txtEndereco = DxTextBox({ id: 'txtEndereco' }, { readOnly: true }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Endereço' });
    nbbNumero = DxNumberBox({ id: 'nbbNumero' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Número' });
    txtComplemento = DxTextBox({ id: 'txtComplemento' }, {});
    txtBairro = DxTextBox({ id: 'txtBairro' }, { readOnly: true }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Bairro' });
    txtCidade = DxTextBox({ id: 'txtCidade' }, { readOnly: true }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Cidade' });
    slbEstado = DxSelectBox({ id: 'slbEstado', description: 'sigla', value: 'sigla' }, {
        readOnly: true,
        dataSource: GetEstados()
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Estado' });
    txtNaturalidade = DxTextBox({ id: 'txtNaturalidade' }, {
        placeholder: 'Ex: Maracanaú'
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'Naturalidade' });
    slbEstadoNaturalidade = DxSelectBox({ id: 'slbEstadoNaturalidade', description: 'sigla', value: 'sigla' }, {
        dataSource: GetEstados()
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'Estado Naturalidade' });
    nbbPeso = DxNumberBox({ id: 'nbbPeso' }, {}, { rules: ['required'], validationGroup: grupoValidacao, name: 'Peso' });
    nbbAltura = DxNumberBox({ id: 'nbbAltura' }, {}, { rules: ['required'], validationGroup: grupoValidacao, name: 'Altura' });
    nbbCalca = DxNumberBox({ id: 'nbbCalca' }, {}, { rules: ['required'], validationGroup: grupoValidacao, name: 'Calça' });
    nbbCamisa = DxNumberBox({ id: 'nbbCamisa' }, {}, { rules: ['required'], validationGroup: grupoValidacao, name: 'Camisa' });
    nbbSapato = DxNumberBox({ id: 'nbbSapato' }, {}, { rules: ['required'], validationGroup: grupoValidacao, name: 'Sapato' });
    txtFone = DxTextBox({ id: 'txtFone' }, { mask: "(00) 0000-0000" });
    txtCelular = DxTextBox({ id: 'txtCelular' }, {
        mask: "(00) 00000-0000"
    }, { rules: ['required'], validationGroup: grupoValidacao, name: 'Celular' });
    txtRecado = DxTextBox({ id: 'txtRecado' }, {});
    txtEmail = DxTextBox({ id: 'txtEmail' }, {}, {
        rules: ['email'],
        validationGroup: grupoValidacao,
        name: 'Email',
        validationRules: [{
            type: "custom",
            validationCallback: (e) => e.value,
            message: "Informe seu e-mail, caso não o tenha, informe algum outro de sua confiança."
        }]
    });
    txtLinkedIn = DxTextBox({ id: 'txtLinkedIn' }, {});
    txtNomePai = DxTextBox({ id: 'txtNomePai' }, {});
    slbPaiNacionalidade = DxSelectBox({ id: 'slbPaiNacionalidade', description: 'exibicao', value: 'exibicao' }, {
        value: 'Brasileiro',
        dataSource: GetSelectBox(['Argentino', 'Brasileiro', 'Chileno', 'Colombiano', 'Mexicano', 'Peruano'])
    });
    txtNomeMae = DxTextBox({ id: 'txtNomeMae' }, {});
    slbMaeNacionalidade = DxSelectBox({ id: 'slbMaeNacionalidade', description: 'exibicao', value: 'exibicao' }, {
        value: 'Brasileiro',
        dataSource: GetSelectBox(['Argentino', 'Brasileiro', 'Chileno', 'Colombiano', 'Mexicano', 'Peruano'])
    });
    txtConjuge = DxTextBox({ id: 'txtConjuge' }, {}, {
        validationGroup: grupoValidacao,
        validationRules: [{
            type: "custom",
            validationCallback: (e) => {
                if (slbEstadoCivil.option('displayValue') === 'Casado') {
                    return e.value;
                }

                return true;
            },
            message: "Você informou que é casado, favor informar o nome do Cônjuge"
        }]
    });
    slbNacionalidadeConjuge = DxSelectBox({ id: 'slbNacionalidadeConjuge', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Argentino', 'Brasileiro', 'Chileno', 'Colombiano', 'Mexicano', 'Peruano'])
    }, {
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => {
                    if (slbEstadoCivil.option('displayValue') === 'Casado') {
                        return e.value;
                    }

                    return true;
                },
                message: "Você informou que é casado, favor informar a nacionalidade do Cônjuge"
            }]
        });
    slbDeficiencia = DxSelectBox({ id: 'slbDeficiencia', description: 'exibicao', value: 'valor' }, {
        dataSource: getBooleanValues(),
        value: false,
        onValueChanged: (e) => {
            $('#divDeficiencia').css('display', e.value ? '' : 'none');

            if (!e.value) {
                txtDeficiencia.option('value', '');
            }
        }
    });
    txtDeficiencia = DxTextBox({ id: 'txtDeficiencia' }, {
        placeholder: 'Qual?'
    }, {
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => {
                    if (slbDeficiencia.option('value') === true) {
                        return e.value;
                    }

                    return true;
                },
                message: "Você indicou que possuia alguma deficiência, qual seria?"
            }]
        });
    document.getElementById('divFilhos').innerHTML = '';

    slbFilho = DxSelectBox({ id: 'slbFilho', description: 'exibicao', value: 'valor' }, {
        dataSource: getBooleanValues(),
        value: false,
        onValueChanged: (e) => {
            $('#divNumeroFilho').css('display', e.value ? '' : 'none');

            if (!e.value) {
                document.getElementById('divFilhos').innerHTML = '';
            }

            slbNumeroFilho.option('visible', e.value);
        }
    });
    slbNumeroFilho = DxSelectBox({ id: 'slbNumeroFilho', description: 'exibicao', value: 'exibicao' }, {
        visible: false,
        dataSource: GetSelectBox(Array(10).fill().map((v, i) => i + 1)),
        onValueChanged: (e) => createFilhoFields(e.value, grupoValidacao)
    }, {
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom", validationCallback: (e) => {
                    if (slbFilho.option('value') === true) {
                        return e.value;
                    }

                    return true;
                }, message: "Você indicou que possuia filhos, quantos são?"
            }]
        });

    btnIdentificacao = DxButton({ id: 'btnIdentificacao', text: 'Salvar' }, {
        icon: 'check',
        validationGroup: grupoValidacao,
        onClick: (e) => {
            e.event.preventDefault();

            const validation = e.validationGroup.validate();
            if (validation.isValid) {
                SaveLocal(grupoValidacao, () => Next('btnIden', 'btnDoc'));
            }
        }
    });
}

function InitializeDocumentacao() {
    let grupoValidacao = 'documentacaoRules';

    $("#divDocumentacaoValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    txtCarteiraTrabalho = DxTextBox({ id: 'txtCarteiraTrabalho' }, {}, { validationGroup: grupoValidacao, rules: ['required', 'numeric'], name: 'Carteira de Trabalho' });
    nbbSerie = DxNumberBox({ id: 'nbbSerie' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Série' });
    slbEstadoEmissor = DxSelectBox({ id: 'slbEstadoEmissor', description: 'sigla', value: 'sigla' },
        {
            dataSource: GetEstados()
        }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Estado Emissor' });
    txtTitulo = DxTextBox({ id: 'txtTitulo' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Título' });
    txtZona = DxTextBox({ id: 'txtZona' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Zona' });
    txtSessao = DxTextBox({ id: 'txtSessao' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Sessão' });
    txtReservista = DxTextBox({ id: 'txtReservista' }, { disabled: true });
    txtHabilitacao = DxTextBox({ id: 'txtHabilitacao' }, {});
    slbCategoria = DxSelectBox({ id: 'slbCategoria', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['A', 'B', 'AB', 'C', 'D', 'E'])
    });
    txtRg = DxTextBox({ id: 'txtRg' }, {}, { validationGroup: grupoValidacao, rules: ['required', 'numeric'], name: 'RG' });
    dtbRgEmissao = DxDateBox({ id: 'dtbRgEmissao' }, { value: null }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Data Emissão' });
    txtRgEmissor = DxTextBox({ id: 'txtRgEmissor' }, {}, { validationGroup: grupoValidacao, rules: ['required'], name: 'Emissor' });
    txtRgOrgaoClasse = DxTextBox({ id: 'txtRgOrgaoClasse' }, {});
    nbbRgNumRegistro = DxNumberBox({ id: 'nbbRgNumRegistro' }, {});
    txtPis = DxTextBox({ id: 'txtPis' }, {}, { validationGroup: grupoValidacao, rules: ['required', 'numeric'], name: 'PIS' });

    btnDocumentacao = DxButton({ id: 'btnDocumentacao', text: 'Salvar' }, {
        icon: 'check',
        validationGroup: grupoValidacao,
        onClick: (e) => {
            e.event.preventDefault();

            const validation = e.validationGroup.validate();
            if (validation.isValid) {
                SaveLocal(grupoValidacao, () => Next('btnDoc', 'btnFA'));
            }
        }
    });
}

function InitializeFormacao() {
    let grupoValidacao = 'formacaoRules';

    $("#divFormacaoValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    slbGrauInstrucao = DxSelectBox({ id: 'slbGrauInstrucao', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Ensino Fundamental - Completo', 'Ensino Fundamental - Incompleto', 'Ensino Fundamental - Em Andamento', 'Ensino Médio – Completo', 'Ensino Médio – Incompleto', 'Ensino Médio – Andamento'])
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Grau de Instrução' });

    slbFormacaoCurso = DxSelectBox({ id: 'slbFormacaoCurso', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Técnico', 'Superior', 'Pós - Graduação'])
    });
    txtDescricaoCurso = DxTextBox({ id: 'txtDescricaoCurso' }, {});
    txtInstituicaoCurso = DxTextBox({ id: 'txtInstituicaoCurso' }, {});
    slbAnoConclusaoCurso = DxSelectBox({ id: 'slbAnoConclusaoCurso', description: 'exibicao', value: 'valor' }, {
        dataSource: getAnosConclusao()
    });
    slbIdioma = DxSelectBox({ id: 'slbIdioma', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Inglês', 'Espanhol', 'Alemão', 'Italiano', 'Outros'])
    });
    slbFluenciaIdioma = DxSelectBox({ id: 'slbFluenciaIdioma', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['Básico', 'Intermediário', 'Avançado', 'Fluente'])
    });
    txtDescricaoIdioma = DxTextBox({ id: 'txtDescricaoIdioma' }, {});
    txtInstituicaoIdioma = DxTextBox({ id: 'txtInstituicaoIdioma' }, {});
    slbAnoConclusaoIdioma = DxSelectBox({ id: 'slbAnoConclusaoIdioma', description: 'exibicao', value: 'valor' }, {
        dataSource: getAnosConclusao()
    });
    txtExtraCurricular = DxTextBox({ id: 'txtExtraCurricular' }, {});
    txtInstituicaoExtra = DxTextBox({ id: 'txtInstituicaoExtra' }, {});
    slbAnoConclusaoExtra = DxSelectBox({ id: 'slbAnoConclusaoExtra', description: 'exibicao', value: 'valor' }, {
        dataSource: getAnosConclusao()
    });

    grdCurso = DxDataGrid({ id: 'grdCurso' }, getGridCursoExtension());
    btnAddFormacao = DxButton({ id: 'btnAddFormacao' }, {
        icon: 'plus',
        onClick: () => {
            if (slbFormacaoCurso.option('value') && txtDescricaoCurso.option('value') && txtInstituicaoCurso.option('value') && slbAnoConclusaoCurso.option('value')) {
                const curso = {
                    cdCurso: 0,
                    cdCandidato: 0,
                    stTipoFormacao: 1,
                    dsNivel: '',
                    dsTipoCurso: slbFormacaoCurso.option('value'),
                    dsCurso: txtDescricaoCurso.option('value'),
                    dsInstituicao: txtInstituicaoCurso.option('value'),
                    stAnoConclusao: slbAnoConclusaoCurso.option('value')
                };

                if (grdCurso.option('visible') === false) {
                    grdCurso.option('visible', true);
                }

                if (curso) {
                    let cursos = [...grdCurso.getDataSource().items()].concat([curso]);
                    grdCurso.option('dataSource', cursos);
                    clearCurso();
                }
            }
        }
    });
    btnUpdFormacao = DxButton({ id: 'btnUpdFormacao' }, {
        icon: 'check',
        type: 'success',
        visible: false,
        onClick: () => {
            const key = $('#hiddenCursoKey').val();
            if (key) {
                grdCurso.getSelectedRowsData()[0].dsTipoCurso = slbFormacaoCurso.option('value');
                grdCurso.getSelectedRowsData()[0].dsCurso = txtDescricaoCurso.option('value');
                grdCurso.getSelectedRowsData()[0].dsInstituicao = txtInstituicaoCurso.option('value');
                grdCurso.getSelectedRowsData()[0].stAnoConclusao = slbAnoConclusaoCurso.option('value');

                grdCurso.refresh();

                btnAddFormacao.option('visible', true);
                btnUpdFormacao.option('visible', false);
                btnDelFormacao.option('visible', false);

                clearCurso();
            }
        }
    });
    btnDelFormacao = DxButton({ id: 'btnDelFormacao' }, {
        icon: 'trash',
        type: 'danger',
        visible: false,
        onClick: () => {
            const key = $('#hiddenCursoKey').val();
            if (key) {
                grdCurso.deleteRow(key);
            }
        }
    });

    grdIdioma = DxDataGrid({ id: 'grdIdioma' }, getGridIdiomaExtension());
    btnAddIdioma = DxButton({ id: 'btnAddIdioma' }, {
        icon: 'plus',
        onClick: () => {
            if (slbIdioma.option('value') && slbFluenciaIdioma.option('value') && txtDescricaoIdioma.option('value') && txtInstituicaoIdioma.option('value') && slbAnoConclusaoIdioma.option('value')) {
                const idioma = {
                    cdIdioma: 0,
                    cdCandidato: 0,
                    stTipoFormacao: 2,
                    dsTipoCurso: slbIdioma.option('value'),
                    dsNivel: slbFluenciaIdioma.option('value'),
                    dsCurso: txtDescricaoIdioma.option('value'),
                    dsInstituicao: txtInstituicaoIdioma.option('value'),
                    stAnoConclusao: slbAnoConclusaoIdioma.option('value')
                };

                if (grdIdioma.option('visible') === false) {
                    grdIdioma.option('visible', true);
                }

                if (idioma) {
                    let idiomas = [...grdIdioma.getDataSource().items()].concat([idioma]);
                    grdIdioma.option('dataSource', idiomas);

                    clearIdioma();
                }
            }
        }
    });
    btnUpdIdioma = DxButton({ id: 'btnUpdIdioma' }, {
        icon: 'check',
        type: 'success',
        visible: false,
        onClick: () => {
            const key = $('#hiddenIdiomaKey').val();
            if (key) {
                grdIdioma.getSelectedRowsData()[0].dsTipoCurso = slbIdioma.option('value');
                grdIdioma.getSelectedRowsData()[0].dsNivel = slbFluenciaIdioma.option('value');
                grdIdioma.getSelectedRowsData()[0].dsCurso = txtDescricaoIdioma.option('value');
                grdIdioma.getSelectedRowsData()[0].dsInstituicao = txtInstituicaoIdioma.option('value');
                grdIdioma.getSelectedRowsData()[0].stAnoConclusao = slbAnoConclusaoIdioma.option('value');
                grdIdioma.refresh();

                btnAddIdioma.option('visible', true);
                btnUpdIdioma.option('visible', false);
                btnDelIdioma.option('visible', false);

                clearIdioma();
            }
        }
    });
    btnDelIdioma = DxButton({ id: 'btnDelIdioma' }, {
        icon: 'trash',
        type: 'danger',
        visible: false,
        onClick: () => {
            const key = $('#hiddenIdiomaKey').val();
            if (key) {
                grdIdioma.deleteRow(key);
            }
        }
    });

    grdExtra = DxDataGrid({ id: 'grdExtra' }, getGridExtraCurricularExtension());
    btnAddExtra = DxButton({ id: 'btnAddExtra' }, {
        icon: 'plus',
        onClick: () => {
            if (txtExtraCurricular.option('value') && txtInstituicaoExtra.option('value') && slbAnoConclusaoExtra.option('value')) {
                const extra = {
                    cdIdioma: 0,
                    cdCandidato: 0,
                    stTipoFormacao: 3,
                    dsNivel: '',
                    dsTipoCurso: 'Extra Curricular',
                    dsCurso: txtExtraCurricular.option('value'),
                    dsInstituicao: txtInstituicaoExtra.option('value'),
                    stAnoConclusao: slbAnoConclusaoExtra.option('value')
                };

                if (grdExtra.option('visible') === false) {
                    grdExtra.option('visible', true);
                }

                if (extra) {
                    let extras = [...grdExtra.getDataSource().items()].concat([extra]);
                    grdExtra.option('dataSource', extras);

                    clearExtraCurricular();
                }
            }
        }
    });
    btnUpdExtra = DxButton({ id: 'btnUpdExtra' }, {
        icon: 'check',
        type: 'success',
        visible: false,
        onClick: () => {
            const key = $('#hiddenExtraKey').val();
            if (key) {
                grdExtra.getSelectedRowsData()[0].dsCurso = txtExtraCurricular.option('value');
                grdExtra.getSelectedRowsData()[0].dsInstituicao = txtInstituicaoExtra.option('value');
                grdExtra.getSelectedRowsData()[0].stAnoConclusao = slbAnoConclusaoExtra.option('value');
                grdExtra.refresh();

                btnAddExtra.option('visible', true);
                btnUpdExtra.option('visible', false);
                btnDelExtra.option('visible', false);

                clearExtraCurricular();
            }
        }
    });
    btnDelExtra = DxButton({ id: 'btnDelExtra' }, {
        icon: 'trash',
        type: 'danger',
        visible: false,
        onClick: () => {
            const key = $('#hiddenExtraKey').val();
            if (key) {
                grdExtra.deleteRow(key);
            }
        }
    });

    btnFormacao = DxButton({ id: 'btnFormacao', text: 'Salvar' },
        {
            icon: 'check', validationGroup: grupoValidacao,
            onClick: (e) => {
                e.event.preventDefault();

                const validation = e.validationGroup.validate();
                if (validation.isValid) {
                    SaveLocal(grupoValidacao, () => Next('btnFA', 'btnIG'));
                }
            }
        });
}

function InitializeInformacoesGerais() {
    let grupoValidacao = 'geralRules';

    $("#divGeralValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    chkAgencia = DxCheckBox({ id: 'chkAgencia' }, {
        text: 'Agência/Consultoria',
        onValueChanged: (e) => {
            txtAgencia.option('disabled', !e.value);
            if (!e.value) {
                txtAgencia.option('value', '');
            }
        }
    });
    txtAgencia = DxTextBox({ id: 'txtAgencia' }, {
        placeholder: 'Qual?',
        disabled: true
    });
    chkInternet = DxCheckBox({ id: 'chkInternet' }, { text: 'Internet' });
    chkSine = DxCheckBox({ id: 'chkSine' }, { text: 'SINE' });
    chkOutraForma = DxCheckBox({ id: 'chkOutraForma' }, {
        text: 'Outra Forma',
        onValueChanged: (e) => {
            txtOutraForma.option('disabled', !e.value);
            if (!e.value) {
                txtOutraForma.option('value', '');
            }
        }
    });
    txtOutraForma = DxTextBox({ id: 'txtOutraForma' }, {
        placeholder: 'Qual?',
        disabled: true
    });
    chkIndicacao = DxCheckBox({ id: 'chkIndicacao' }, {
        text: 'Indicação',
        onValueChanged: (e) => {
            txtNomeIndicacao.option('disabled', !e.value);
            txtCargoIndicacao.option('disabled', !e.value);
            txtUnidadeIndicacao.option('disabled', !e.value);

            if (!e.value) {
                txtNomeIndicacao.option('value', '');
                txtCargoIndicacao.option('value', '');
                txtUnidadeIndicacao.option('value', '');
            }
        }
    });
    txtNomeIndicacao = DxTextBox({ id: 'txtNomeIndicacao' }, {
        placeholder: 'Nome',
        disabled: true
    });
    txtCargoIndicacao = DxTextBox({ id: 'txtCargoIndicacao' }, {
        placeholder: 'Cargo/Setor',
        disabled: true
    });
    txtUnidadeIndicacao = DxTextBox({ id: 'txtUnidadeIndicacao' }, {
        placeholder: 'Unidade/Turno',
        disabled: true
    });
    slbJaTrabalhou = DxSelectBox({ id: 'slbJaTrabalhou', description: 'exibicao', value: 'valor' }, {
        dataSource: getBooleanValues(),
        value: false,
        onValueChanged: (e) => {
            txtCargoTrabalhado.option('disabled', e.value === false);
            txtAreaTrabalhada.option('disabled', e.value === false);
            txtChefeTrabalhado.option('disabled', e.value === false);

            if (!e.value || e.value === false) {
                txtCargoTrabalhado.option('value', '');
                txtAreaTrabalhada.option('value', '');
                txtChefeTrabalhado.option('value', '');
            }
        }
    });

    const jaTrabalhouValidation = (message) => {
        return {
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => {
                    if (slbJaTrabalhou.option('value') === true) {
                        return e.value;
                    }

                    return true;
                },
                message: message
            }]
        };
    };

    txtCargoTrabalhado = DxTextBox({ id: 'txtCargoTrabalhado' }, {
        placeholder: 'Cargo',
        disabled: true
    }, jaTrabalhouValidation('Em qual Cargo você trabalhou antes?'));
    txtAreaTrabalhada = DxTextBox({ id: 'txtAreaTrabalhada' }, {
        placeholder: 'Área',
        disabled: true
    }, jaTrabalhouValidation('Em qual Área você trabalhou antes?'));
    txtChefeTrabalhado = DxTextBox({ id: 'txtChefeTrabalhado' }, {
        placeholder: 'Chefia',
        disabled: true
    }, jaTrabalhouValidation('Quem foi sua Chefia?'));

    btnGeral = DxButton({ id: 'btnGeral', text: 'Salvar' },
        {
            icon: 'check', validationGroup: grupoValidacao,
            onClick: (e) => {
                e.event.preventDefault();

                const validation = e.validationGroup.validate();
                if (validation.isValid) {
                    SaveLocal(grupoValidacao, () => Next('btnIG', 'btnEP'));
                }
            }
        });
}

function InitializeExperiencias() {
    let grupoValidacao = 'experienciaRules';

    $("#divExperienciaValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    txtEmpresa = DxTextBox({ id: 'txtEmpresa' }, {});
    txtTelefone = DxTextBox({ id: 'txtTelefone' }, {
        mask: "(00) 99999-9999"
    });
    dtbEntrada = DxDateBox({ id: 'dtbEntrada' }, { value: null });
    dtbSaida = DxDateBox({ id: 'dtbSaida' }, { value: null });
    txtCargoInicial = DxTextBox({ id: 'txtCargoInicial' }, {});
    txtCargoFinal = DxTextBox({ id: 'txtCargoFinal' }, {});
    nbbUltimoSalario = DxNumberBox({ id: 'nbbUltimoSalario' }, {
        format: { style: "currency", currency: "BRL", useGrouping: true },
        value: 0
    });
    chkValeTransporte = DxCheckBox({ id: 'chkValeTransporte' }, { text: 'Vale-transporte' });
    chkValeRefeicao = DxCheckBox({ id: 'chkValeRefeicao' }, { text: 'Vale-refeição' });
    chkAssistenciaMedica = DxCheckBox({ id: 'chkAssistenciaMedica' }, { text: 'Assistência médica' });
    chkPlanoOdontologico = DxCheckBox({ id: 'chkPlanoOdontologico' }, { text: 'Plano odontológico' });
    chkBolsaEstudo = DxCheckBox({ id: 'chkBolsaEstudo' }, { text: 'Bolsas de estudo' });
    chkCestaBasica = DxCheckBox({ id: 'chkCestaBasica' }, { text: 'Cesta básica' });
    chkValeAlimentcao = DxCheckBox({ id: 'chkValeAlimentcao' }, { text: 'Vale-alimentação' });
    chkRefeitorioLocal = DxCheckBox({ id: 'chkRefeitorioLocal' }, { text: 'Refeitório no local' });
    chkValeCultura = DxCheckBox({ id: 'chkValeCultura' }, { text: 'Vale-cultura' });
    chkAuxilioCreche = DxCheckBox({ id: 'chkAuxilioCreche' }, { text: 'Auxílio-creche' });
    chkHorarioFlexivel = DxCheckBox({ id: 'chkHorarioFlexivel' }, { text: 'Horário flexível' });
    chkOutros = DxCheckBox({ id: 'chkOutros' }, {
        text: 'Outros',
        onValueChanged: (e) => {
            txtOutros.option('disabled', !e.value);
        }
    });
    txtOutros = DxTextBox({ id: 'txtOutros' }, {
        placeholder: 'Quais?',
        disabled: true
    });
    txtMotivoSaida = DxTextBox({ id: 'txtMotivoSaida' }, {});

    grdExperiencia = DxDataGrid({ id: 'grdExperiencia' }, getGridExperienciasExtension());

    btnAddExperiencia = DxButton({ id: 'btnAddExperiencia' }, {
        icon: 'plus',
        text: 'Incluir',
        onClick: () => {
            if (txtEmpresa.option('value') && txtTelefone.option('value') && dtbEntrada.option('value') && dtbSaida.option('value') && txtCargoInicial.option('value')
                && txtCargoFinal.option('value') && nbbUltimoSalario.option('value') && txtMotivoSaida.option('value')) {
                const experiencia = {
                    cdExperiencia: 0,
                    cdCandidato: 0,
                    dsEmpresa: txtEmpresa.option('value'),
                    dsTelefone: txtTelefone.option('value'),
                    dtEntrada: dtbEntrada.option('value'),
                    dtSaida: dtbSaida.option('value'),
                    dsCargoInicial: txtCargoInicial.option('value'),
                    dsCargoFinal: txtCargoFinal.option('value'),
                    stSalario: nbbUltimoSalario.option('value'),
                    stValeTransporte: chkValeTransporte.option('value'),
                    stValeRefeicao: chkValeRefeicao.option('value'),
                    stAssistenciaMedica: chkAssistenciaMedica.option('value'),
                    stPlanoOdontologico: chkPlanoOdontologico.option('value'),
                    stBolsasEstudo: chkBolsaEstudo.option('value'),
                    stCestaBasica: chkCestaBasica.option('value'),
                    stValeAlimentacao: chkValeAlimentcao.option('value'),
                    stRefeitorioLocal: chkRefeitorioLocal.option('value'),
                    stValeCultura: chkValeCultura.option('value'),
                    stAuxilioCreche: chkAuxilioCreche.option('value'),
                    stHorarioFlexivel: chkHorarioFlexivel.option('value'),
                    stOutros: chkOutros.option('value'),
                    dsOutros: txtOutros.option('value'),
                    dsMotivoSaida: txtMotivoSaida.option('value')
                };

                if (grdExperiencia.option('visible') === false) {
                    grdExperiencia.option('visible', true);
                }

                if (experiencia) {
                    let experiencias = [...grdExperiencia.getDataSource().items()].concat([experiencia]);
                    grdExperiencia.option('dataSource', experiencias);

                    clearExperiencia();
                }
            }
        }
    });
    btnUpdExperiencia = DxButton({ id: 'btnUpdExperiencia' }, {
        icon: 'check',
        text: 'Atualizar',
        type: 'success',
        visible: false,
        onClick: () => {
            const key = $('#hiddenExperienciaKey').val();
            if (key) {
                grdExperiencia.getSelectedRowsData()[0].dsEmpresa = txtEmpresa.option('value');
                grdExperiencia.getSelectedRowsData()[0].dsTelefone = txtTelefone.option('value');
                grdExperiencia.getSelectedRowsData()[0].dtEntrada = dtbEntrada.option('value');
                grdExperiencia.getSelectedRowsData()[0].dtSaida = dtbSaida.option('value');
                grdExperiencia.getSelectedRowsData()[0].dsCargoInicial = txtCargoInicial.option('value');
                grdExperiencia.getSelectedRowsData()[0].dsCargoFinal = txtCargoFinal.option('value');
                grdExperiencia.getSelectedRowsData()[0].stSalario = nbbUltimoSalario.option('value');
                grdExperiencia.getSelectedRowsData()[0].stValeTransporte = chkValeTransporte.option('value');
                grdExperiencia.getSelectedRowsData()[0].stValeRefeicao = chkValeRefeicao.option('value');
                grdExperiencia.getSelectedRowsData()[0].stAssistenciaMedica = chkAssistenciaMedica.option('value');
                grdExperiencia.getSelectedRowsData()[0].stPlanoOdontologico = chkPlanoOdontologico.option('value');
                grdExperiencia.getSelectedRowsData()[0].stBolsasEstudo = chkBolsaEstudo.option('value');
                grdExperiencia.getSelectedRowsData()[0].stCestaBasica = chkCestaBasica.option('value');
                grdExperiencia.getSelectedRowsData()[0].stValeAlimentacao = chkValeAlimentcao.option('value');
                grdExperiencia.getSelectedRowsData()[0].stRefeitorioLocal = chkRefeitorioLocal.option('value');
                grdExperiencia.getSelectedRowsData()[0].stValeCultura = chkValeCultura.option('value');
                grdExperiencia.getSelectedRowsData()[0].stAuxilioCreche = chkAuxilioCreche.option('value');
                grdExperiencia.getSelectedRowsData()[0].stHorarioFlexivel = chkHorarioFlexivel.option('value');
                grdExperiencia.getSelectedRowsData()[0].stOutros = chkOutros.option('value');
                grdExperiencia.getSelectedRowsData()[0].dsOutros = txtOutros.option('value');
                grdExperiencia.getSelectedRowsData()[0].dsMotivoSaida = txtMotivoSaida.option('value');
                grdExperiencia.refresh();

                btnAddExperiencia.option('visible', true);
                btnUpdExperiencia.option('visible', false);
                btnDelExperiencia.option('visible', false);

                clearExperiencia();
            }
        }
    });
    btnDelExperiencia = DxButton({ id: 'btnDelExperiencia' }, {
        icon: 'trash',
        text: 'Remover',
        type: 'danger',
        visible: false,
        onClick: () => {
            const key = $('#hiddenExperienciaKey').val();
            if (key) {
                grdExperiencia.deleteRow(key);
            }
        }
    });

    btnExperiencia = DxButton({ id: 'btnExperiencia', text: 'Salvar' },
        {
            icon: 'check', validationGroup: grupoValidacao,
            onClick: (e) => {
                e.event.preventDefault();

                const validation = e.validationGroup.validate();
                if (validation.isValid) {
                    SaveLocal(grupoValidacao, () => Next('btnEP', 'btnPO'));
                }
            }
        });
}

function InitializePretensao() {
    let grupoValidacao = 'pretensaoRules';

    $("#divPretensaoValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    slbCargo = DxSelectBox({ id: 'slbCargo', description: 'dsCargo', value: 'cdCargo' }, {},
        { validationGroup: grupoValidacao, rules: ['required'], name: 'Cargo' });
    slbTrabalharHoraExtra = DxSelectBox({ id: 'slbTrabalharHoraExtra', description: 'exibicao', value: 'valor' }, {
        dataSource: getBooleanValues(),
        value: false
    });
    slbHorarioDesejado = DxSelectBox({ id: 'slbHorarioDesejado', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(['05:30 às 13:50', '13:50 às 22:09', '22:09 às 05:30', 'Comercial'])
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Horario Desejado' });
    slbPretensaoSalarial = DxSelectBox({ id: 'slbPretensaoSalarial', description: 'exibicao', value: 'exibicao' }, {
        dataSource: GetSelectBox(getSalarios())
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Pretensão Salarial' });
    txaDescricaoPessoal = DxTextArea({ id: 'txaDescricaoPessoal' }, {});

    btnPretensao = DxButton({ id: 'btnPretensao', text: 'Finalizar' },
        {
            icon: 'check', validationGroup: grupoValidacao,
            onClick: (e) => {
                e.event.preventDefault();

                const validation = e.validationGroup.validate();
                if (validation.isValid) {
                    SaveLocal(grupoValidacao, () => {
                        Next('btnPO', 'btnIden');

                        Save();
                    });
                }
            }
        });

    GetCargos();
}

function getGridCursoExtension() {
    return {
        dataSource: {
            store: [],
            reshapeOnPush: true
        },
        allowColumnResizing: true,
        paging: {
            enabled: false
        },
        pager: {
            visible: false
        },
        showBorders: true,
        remoteOperations: true,
        searchPanel: { visible: false },
        export: { enabled: false },
        columnChooser: { enabled: false },
        visible: false,
        columns: [
            { dataField: 'cdCurso', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'cdCandidato', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'stTipoFormacao', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsNivel', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsTipoCurso', caption: 'Formação', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsCurso', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsInstituicao', caption: 'Instituição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            {
                dataField: 'stAnoConclusao', caption: 'Ano conclusão', encodeHtml: false, alignment: 'left', showInColumnChooser: false,
                cellTemplate: (container, options) => {
                    const conclusao = options.data.stAnoConclusao === 9999 ? 'Em andamento' : options.data.stAnoConclusao;
                    $("<span>")
                        .text(conclusao)
                        .appendTo(container);
                    container.append(" ");
                }
            }
        ],
        onRowClick: (e) => {
            slbFormacaoCurso.option('value', e.data.dsTipoCurso);
            txtDescricaoCurso.option('value', e.data.dsCurso);
            txtInstituicaoCurso.option('value', e.data.dsInstituicao);
            slbAnoConclusaoCurso.option('value', e.data.stAnoConclusao);

            btnAddFormacao.option('visible', false);
            btnDelFormacao.option('visible', true);
            btnUpdFormacao.option('visible', true);
            $('#hiddenCursoKey').val(e.rowIndex);
        },
        onRowRemoved: (e) => {
            DeleteCurso(e.data, () => {
                clearCurso();

                btnAddFormacao.option('visible', true);
                btnDelFormacao.option('visible', false);
                btnUpdFormacao.option('visible', false);

                if (grdCurso.getDataSource().items().length === 0) {
                    grdCurso.option('visible', false);
                }
            });
        }
    };
}

function getGridIdiomaExtension() {
    return {
        dataSource: {
            store: [],
            reshapeOnPush: true
        },
        allowColumnResizing: true,
        paging: {
            enabled: false
        },
        pager: {
            visible: false
        },
        showBorders: true,
        remoteOperations: true,
        searchPanel: { visible: false },
        export: { enabled: false },
        columnChooser: { enabled: false },
        visible: false,
        columns: [
            { dataField: 'cdCurso', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'cdCandidato', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'stTipoFormacao', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsNivel', caption: 'Fluência', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsTipoCurso', caption: 'Curso', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsCurso', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsInstituicao', caption: 'Instituição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            {
                dataField: 'stAnoConclusao', caption: 'Ano conclusão', encodeHtml: false, alignment: 'left', showInColumnChooser: false,
                cellTemplate: (container, options) => {
                    const conclusao = options.data.stAnoConclusao === 9999 ? 'Em andamento' : options.data.stAnoConclusao;
                    $("<span>")
                        .text(conclusao)
                        .appendTo(container);
                    container.append(" ");
                }
            }
        ],
        onRowClick: (e) => {
            slbIdioma.option('value', e.data.dsTipoCurso);
            slbFluenciaIdioma.option('value', e.data.dsNivel);
            txtDescricaoIdioma.option('value', e.data.dsCurso);
            txtInstituicaoIdioma.option('value', e.data.dsInstituicao);
            slbAnoConclusaoIdioma.option('value', e.data.stAnoConclusao);

            btnAddIdioma.option('visible', false);
            btnDelIdioma.option('visible', true);
            btnUpdIdioma.option('visible', true);
            $('#hiddenIdiomaKey').val(e.rowIndex);
        },
        onRowRemoved: (e) => {
            DeleteCurso(e.data, () => {
                clearIdioma();

                btnAddIdioma.option('visible', true);
                btnDelIdioma.option('visible', false);
                btnUpdIdioma.option('visible', false);

                if (grdIdioma.getDataSource().items().length === 0) {
                    grdIdioma.option('visible', false);
                }
            });
        }
    };
}

function getGridExtraCurricularExtension() {
    return {
        dataSource: {
            store: [],
            reshapeOnPush: true
        },
        allowColumnResizing: true,
        paging: {
            enabled: false
        },
        pager: {
            visible: false
        },
        showBorders: true,
        remoteOperations: true,
        searchPanel: { visible: false },
        export: { enabled: false },
        columnChooser: { enabled: false },
        visible: false,
        columns: [
            { dataField: 'cdCurso', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'cdCandidato', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'stTipoFormacao', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsNivel', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsTipoCurso', caption: '#', encodeHtml: false, alignment: 'left', visible: false, showInColumnChooser: false },
            { dataField: 'dsCurso', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsInstituicao', caption: 'Instituição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            {
                dataField: 'stAnoConclusao', caption: 'Ano conclusão', encodeHtml: false, alignment: 'left', showInColumnChooser: false,
                cellTemplate: (container, options) => {
                    const conclusao = options.data.stAnoConclusao === 9999 ? 'Em andamento' : options.data.stAnoConclusao;
                    $("<span>")
                        .text(conclusao)
                        .appendTo(container);
                    container.append(" ");
                }
            }
        ],
        onRowClick: (e) => {
            txtExtraCurricular.option('value', e.data.dsCurso);
            txtInstituicaoExtra.option('value', e.data.dsInstituicao);
            slbAnoConclusaoExtra.option('value', e.data.stAnoConclusao);

            btnAddExtra.option('visible', false);
            btnDelExtra.option('visible', true);
            btnUpdExtra.option('visible', true);
            $('#hiddenExtraKey').val(e.rowIndex);
        },
        onRowRemoved: (e) => {
            DeleteCurso(e.data, () => {
                clearExtraCurricular();

                btnAddExtra.option('visible', true);
                btnDelExtra.option('visible', false);
                btnUpdExtra.option('visible', false);

                if (grdExtra.getDataSource().items().length === 0) {
                    grdExtra.option('visible', false);
                }
            });
        }
    };
}

function getGridExperienciasExtension() {
    return {
        dataSource: {
            store: [],
            reshapeOnPush: true
        },
        allowColumnResizing: true,
        paging: {
            enabled: false
        },
        pager: {
            visible: false
        },
        showBorders: true,
        remoteOperations: true,
        searchPanel: { visible: false },
        export: { enabled: false },
        columnChooser: { enabled: false },
        visible: false,
        columns: [
            { dataField: 'cdExperiencia', caption: '#', encodeHtml: false, visible: false, showInColumnChooser: false },
            { dataField: 'cdCandidato', caption: '#', encodeHtml: false, visible: false, showInColumnChooser: false },
            { dataField: 'dsEmpresa', caption: 'Empresa', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'dsTelefone', caption: 'Telefone', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'dtEntrada', caption: 'Data de Entrada', dataType: 'date', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'dtSaida', caption: 'Data de Saída', dataType: 'date', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'dsCargoInicial', caption: 'Cargo Inicial', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'dsCargoFinal', caption: 'Cargo Final', encodeHtml: false, showInColumnChooser: false },
            {
                dataField: 'stSalario', caption: 'Último Salário', encodeHtml: false, alignment: 'right', showInColumnChooser: false,
                format: {
                    type: "fixedPoint",
                    precision: 2
                }
            },
            { dataField: 'dsMotivoSaida', caption: 'Motivo Saída', encodeHtml: false, showInColumnChooser: false },
            { dataField: 'stValeTransporte', caption: 'Vale Transporte', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stValeRefeicao', caption: 'Vale Refeição', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stAssistenciaMedica', caption: 'Assistência Médica', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stPlanoOdontologico', caption: 'Plano Odontológico', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stBolsasEstudo', caption: 'Bolsas de Estudo', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stCestaBasica', caption: 'Cesta Básica', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stValeAlimentacao', caption: 'Vale Alimentação', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stRefeitorioLocal', caption: 'Refeitório no Local', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stValeCultura', caption: 'Vale Cultura', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stAuxilioCreche', caption: 'Auxílio Creche', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stHorarioFlexivel', caption: 'Horário Flexível', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'stOutros', caption: 'Outros Benefícios', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsOutros', caption: 'Descrição dos Benefícios', encodeHtml: false, showInColumnChooser: false }
        ],
        onRowClick: (e) => {
            txtEmpresa.option('value', e.data.dsEmpresa);
            txtTelefone.option('value', e.data.dsTelefone);
            dtbEntrada.option('value', e.data.dtEntrada);
            dtbSaida.option('value', e.data.dtSaida);
            txtCargoInicial.option('value', e.data.dsCargoInicial);
            txtCargoFinal.option('value', e.data.dsCargoFinal);
            nbbUltimoSalario.option('value', e.data.stSalario);
            chkValeTransporte.option('value', e.data.stValeTransporte);
            chkValeRefeicao.option('value', e.data.stValeRefeicao);
            chkAssistenciaMedica.option('value', e.data.stAssistenciaMedica);
            chkPlanoOdontologico.option('value', e.data.stPlanoOdontologico);
            chkBolsaEstudo.option('value', e.data.stBolsasEstudo);
            chkCestaBasica.option('value', e.data.stCestaBasica);
            chkValeAlimentcao.option('value', e.data.stValeAlimentacao);
            chkRefeitorioLocal.option('value', e.data.stRefeitorioLocal);
            chkValeCultura.option('value', e.data.stValeCultura);
            chkAuxilioCreche.option('value', e.data.stAuxilioCreche);
            chkHorarioFlexivel.option('value', e.data.stHorarioFlexivel);
            chkOutros.option('value', e.data.stOutros);
            txtOutros.option('value', e.data.dsOutros);
            txtMotivoSaida.option('value', e.data.dsMotivoSaida);

            btnAddExperiencia.option('visible', false);
            btnDelExperiencia.option('visible', true);
            btnUpdExperiencia.option('visible', true);
            $('#hiddenExperienciaKey').val(e.rowIndex);
        },
        onRowRemoved: (e) => {
            DeleteExperiencia(e.data, () => {
                clearExperiencia();

                btnAddExperiencia.option('visible', true);
                btnDelExperiencia.option('visible', false);
                btnUpdExperiencia.option('visible', false);

                if (grdExperiencia.getDataSource().items().length === 0) {
                    grdExperiencia.option('visible', false);
                }
            });
        }
    };
}

function getAnosConclusao() {
    let anos = [{ exibicao: new Date().getFullYear(), valor: new Date().getFullYear() }];
    for (var i = anos[0].valor - 1; i > anos[0].valor - 50; i--) {
        anos.push({ exibicao: i, valor: i });
    }

    return [
        { exibicao: 'Em andamento', valor: 9999 },
        ...anos
    ];
}

function getSalarios() {
    let salario = 1045;
    let salarios = [];

    while (salario < 25000) {
        if (salarios.length === 0) {
            salarios.push(`${MoneyFormat(salario)} a ${MoneyFormat(1500)}`);
            salario = 1500;
        } else {
            salarios.push(`${MoneyFormat(salario + 1)} a ${MoneyFormat(salario + 500)}`);
            salario += 500;
        }
    }

    return salarios;
}

function createFilhoFields(total, grupoValidacao) {
    let key;
    let fields = document.getElementById('divFilhos');
    fields.innerHTML = '';

    Array(total).fill().forEach((x, i) => {
        key = i + 1;
        var row = document.createElement('div');
        row.className = 'col-md-12';
        row.innerHTML = `
        <div class="row">
            <input type="hidden" id="hiddenCdFilho${key}" />
            <div class="col-md-4">
                <label>Nome filho ${key}</label>
                <div id="txtNomeFilho${key}"></div>
            </div>
            <div class="col-md-2">
                <label>Idade Filho ${key}</label>
                <div id="nbbIdadeFilho${key}"></div>
            </div>
        </div>`;

        fields.appendChild(row);

        $(`#hiddenCdFilho${key}`).val(0);
        DxTextBox({ id: `txtNomeFilho${key}` }, {}, {
            rules: ['required'],
            validationGroup: grupoValidacao,
            name: `Nome do Filho ${key}`
        });
        DxNumberBox({ id: `nbbIdadeFilho${key}` }, { value: null }, {
            rules: ['required'],
            validationGroup: grupoValidacao,
            name: `Idade do Filho ${key}`,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => e.value,
                message: `Informar a Idade do Filho ${key}`
            }]
        });
    });
}

function getFilhoData() {
    const cdCandidato = parseInt($('#hiddenCdCandidato').val() || 0);
    const numFilhos = slbNumeroFilho.option('value');
    let filhos = [];

    for (let i = 1; i <= numFilhos; i++) {
        filhos.push({
            cdCandidato,
            cdFilho: $(`#hiddenCdFilho${i}`).val(),
            dsNome: $(`#txtNomeFilho${i}`).dxTextBox('instance').option('value'),
            stIdade: $(`#nbbIdadeFilho${i}`).dxNumberBox('instance').option('value')
        });
    }

    return filhos;
}

function getCursoData() {
    let cursos = [].concat(grdCurso.getDataSource().items());
    cursos = cursos.concat(grdIdioma.getDataSource().items());
    cursos = cursos.concat(grdExtra.getDataSource().items());

    return cursos;
}

function getExperienciaData() {
    return grdExperiencia.getDataSource().items();
}

function getBooleanValues() {
    return [
        { exibicao: 'Sim', valor: true },
        { exibicao: 'Não', valor: false }
    ];
}

function clearCurso() {
    slbFormacaoCurso.option('value', null);
    txtDescricaoCurso.option('value', null);
    txtInstituicaoCurso.option('value', null);
    slbAnoConclusaoCurso.option('value', null);

    $('#hiddenCursoKey').val(null);
}

function clearIdioma() {
    slbIdioma.option('value', null);
    slbFluenciaIdioma.option('value', null);
    txtDescricaoIdioma.option('value', null);
    txtInstituicaoIdioma.option('value', null);
    slbAnoConclusaoIdioma.option('value', null);

    $('#hiddenIdiomaKey').val(null);
}

function clearExtraCurricular() {
    txtExtraCurricular.option('value', null);
    txtInstituicaoExtra.option('value', null);
    slbAnoConclusaoExtra.option('value', null);

    $('#hiddenExtraKey').val(null);
}

function clearExperiencia() {
    txtEmpresa.option('value', null);
    txtTelefone.option('value', '');
    dtbEntrada.option('value', moment());
    dtbSaida.option('value', moment());
    txtCargoInicial.option('value', null);
    txtCargoFinal.option('value', null);
    nbbUltimoSalario.option('value', 0);
    chkValeTransporte.option('value', null);
    chkValeRefeicao.option('value', null);
    chkAssistenciaMedica.option('value', null);
    chkPlanoOdontologico.option('value', null);
    chkBolsaEstudo.option('value', null);
    chkCestaBasica.option('value', null);
    chkValeAlimentcao.option('value', null);
    chkRefeitorioLocal.option('value', null);
    chkValeCultura.option('value', null);
    chkAuxilioCreche.option('value', null);
    chkHorarioFlexivel.option('value', null);
    chkOutros.option('value', null);
    txtOutros.option('value', null);
    txtMotivoSaida.option('value', null);

    $('#hiddenExperienciaKey').val(null);
}

function GetCargos() {
    data = {
        url: '/Cargo', body: null
    };

    const success = (response) => {
        if (response.success) {
            if (response.data) {
                slbCargo.option('dataSource', response.data);
            }
            else {
                ShowMessage('error', response.message);
            }
        }
        else {
            ShowMessage('error', response.message);
        }
    };

    const error = (response) => {
        ShowMessage('error', response.message);
    };

    SaudeSegurancaGet(data, success, error);
}

function VerificarCandidato(cpf) {
    const local = JSON.parse(localStorage.getItem(localKey));

    if (!local) {
        const data = {
            url: `/Candidato/verify/${cpf}`, body: null
        };

        const success = (response) => {
            if (response.success) {
                if (response.data) {
                    const action = (result) => {
                        if (result) {
                            delete response.data.dsCodigoAcesso;
                            SendValidation(response.data);
                        } else {
                            ShowMessage('info', 'Seus dados serão mantidos em nossa base de Currículum para posteriores seleções.');
                            InitializeComponents();
                        }
                    };

                ShowDialog('Candidato, você já está em nossa Base de Currículum, deseja atualizar os seus dados?', action, DialogTypes.info, 'Currículum');
            }
            else {
                console.log('não achou');
            }
        }
        else {
            ShowMessage('error', response.message);
        }
    };

        SaudeSegurancaGet(data, success, error);
    } else {
        LoadData(local.candidato);
    }
}

function SaveLocal(key, action) {
    let data = null;
    let message = '';

    switch (key) {
        case 'identificacaoRules':
            data = {
                cdCandidato: parseInt($('#hiddenCdCandidato').val() || 0),
                stCpf: txtCpf.option('value'),
                dsNome: txtNome.option('value'),
                stGenero: rdbGenero.option('value'),
                dtNascimento: moment(dtbNascimento.option('value')).format('yyyy-MM-DD'),
                dsEstadoCivil: slbEstadoCivil.option('value'),
                dsNacionalidade: slbNacionalidade.option('value'),
                stCep: txtCep.option('value'),
                dsEndereco: txtEndereco.option('value'),
                stNumero: nbbNumero.option('value'),
                dsComplemento: txtComplemento.option('value'),
                dsBairro: txtBairro.option('value'),
                dsCidade: txtCidade.option('value'),
                dsEstado: slbEstado.option('value'),
                dsNaturalidade: txtNaturalidade.option('value'),
                dsEstadoNaturalidade: slbEstadoNaturalidade.option('value'),
                stPeso: nbbPeso.option('value'),
                stAltura: nbbAltura.option('value'),
                stCalca: nbbCalca.option('value'),
                stCamisa: nbbCamisa.option('value'),
                stSapato: nbbSapato.option('value'),
                dsFone: txtFone.option('value'),
                dsCelular: txtCelular.option('value'),
                dsRecado: txtRecado.option('value'),
                dsEmail: txtEmail.option('value'),
                dsLinkedIn: txtLinkedIn.option('value'),
                dsNomePai: txtNomePai.option('value'),
                dsNacionalidadePai: slbPaiNacionalidade.option('value'),
                dsNomeMae: txtNomeMae.option('value'),
                dsNacionalidadeMae: slbMaeNacionalidade.option('value'),
                dsNomeConjuge: txtConjuge.option('value'),
                dsNacionalidadeConjuge: slbNacionalidadeConjuge.option('value'),
                stPossuiDeficiencia: slbDeficiencia.option('value'),
                stPossuiFilhos: slbFilho.option('value'),
                dsDeficiencia: txtDeficiencia.option('value'),
                FilhoCandidato: getFilhoData()
            };
            message = 'Dados de Identificação salvos com sucesso.';
            break;
        case 'documentacaoRules':
            data = {
                stCTPS: txtCarteiraTrabalho.option('value'),
                stSerieCTPS: nbbSerie.option('value'),
                stEstadoCTPS: slbEstadoEmissor.option('value'),
                stTitulo: txtTitulo.option('value'),
                stZona: txtZona.option('value'),
                stSessao: txtSessao.option('value'),
                stReservista: txtReservista.option('value'),
                stCNH: txtHabilitacao.option('value'),
                stCategoriaCNH: slbCategoria.option('value'),
                stRG: txtRg.option('value'),
                dtEmissaoRG: dtbRgEmissao.option('value'),
                dsOrgaoEmissorRG: txtRgEmissor.option('value'),
                dsOrgaoClasse: txtRgOrgaoClasse.option('value'),
                stNumeroRegistro: nbbRgNumRegistro.option('value'),
                stPIS: txtPis.option('value')
            };
            message = 'Dados dos Documentos salvos com sucesso.';
            break;
        case 'formacaoRules':
            data = {
                cdCandidato: parseInt($('#hiddenCdCandidato').val() || 0),
                dsGrauInstrucao: slbGrauInstrucao.option('value'),
                CursoCandidato: getCursoData()
            };
            message = 'Dados das Formações salvos com sucesso.';
            break;
        case 'geralRules':
            data = {
                cdCandidato: parseInt($('#hiddenCdCandidato').val() || 0),
                stAgencia: chkAgencia.option('value'),
                dsAgencia: txtAgencia.option('value'),
                stInternet: chkInternet.option('value'),
                stSine: chkSine.option('value'),
                stOutraIndicacao: chkOutraForma.option('value'),
                dsOutraIndicacao: txtOutraForma.option('value'),
                stIndicacao: chkIndicacao.option('value'),
                dsNomeIndicacao: txtNomeIndicacao.option('value'),
                dsCargoIndicacao: txtCargoIndicacao.option('value'),
                dsUnidadeIndicacao: txtUnidadeIndicacao.option('value'),
                stTrabalhouAntes: slbJaTrabalhou.option('value'),
                dsCargoTrabalhado: txtCargoTrabalhado.option('value'),
                dsAreaTrabalhada: txtAreaTrabalhada.option('value'),
                dsChefeTrabalhado: txtChefeTrabalhado.option('value')
            };
            message = 'Dados das Informações Gerais salvos com sucesso.';
            break;
        case 'experienciaRules':
            data = {
                cdCandidato: parseInt($('#hiddenCdCandidato').val() || 0),
                ExperienciaCandidato: getExperienciaData()
            };
            message = 'Dados das Experiências salvos com sucesso.';
            break;
        case 'pretensaoRules':
            data = {
                cdCandidato: parseInt($('#hiddenCdCandidato').val() || 0),
                stTrabalhaHoraExtra: slbTrabalharHoraExtra.option('value'),
                dsHorarioPreferencia: slbHorarioDesejado.option('value'),
                dsPretensaoSalarial: slbPretensaoSalarial.option('value'),
                dsDescricaoPessoal: txaDescricaoPessoal.option('value'),
                cdCargo: slbCargo.option('value'),
            };
            message = 'Dados das Pretenções salvos com sucesso.';
            break;
        default:
            break;
    }

    const curriculum = JSON.parse(localStorage.getItem(localKey));
    if (curriculum) {
        localStorage.setItem(localKey, JSON.stringify({ candidato: $.extend(true, curriculum.candidato, data), expiration: moment() }));
    } else {
        localStorage.setItem(localKey, JSON.stringify({ candidato: data, expiration: moment() }));
    }

    ShowMessage('success', message);
    action();
}

function Save() {
    const data = JSON.parse(localStorage.getItem(localKey));

    if (data) {
        const body = {
            url: '/Candidato', body: JSON.stringify(data.candidato)
        };

        if (data.candidato.cdCandidato === 0) {
            const success = (response) => {
                if (response.success) {
                    $('#hiddenCdCandidato').val(parseInt(response.data.cdCandidato));

                    ShowMessage('success', 'Sua Ficha de Cadastro foi Concluída com Sucesso.');

                    localStorage.removeItem(localKey);
                    InitializeComponents();
                }
                else {
                    ShowMessage('error', response.message);
                }
            };

            SaudeSegurancaPost(body, success, error);
        } else {
            const success = (response) => {
                if (response.success) {
                    ShowMessage('success', 'Sua Ficha de Cadastro foi Atualizada com Sucesso!');

                    localStorage.removeItem(localKey);
                    InitializeComponents();
                }
                else {
                    ShowMessage('error', response.message);
                }
            };

            SaudeSegurancaPut(body, success, error);
        }

        return;
    }

    ShowMessage('warning', 'Existem informações importantes não preenchidas, favor verificar.');
}

function DeleteCurso(param, action) {
    if (param.cdCurso !== 0 && param.cdCandidato !== null) {
        data = {
            url: `/CursoCandidato/${param.cdCurso}/${param.cdCandidato}`, body: null
        };

        const error = (response) => {
            ShowMessage('error', response.message);
        };

        const success = (response) => {
            if (response.success) {
                ShowMessage('success', 'Curso Removido com sucesso!');

                action();
            }
            else {
                ShowMessage('error', response.message);
            }
        };

        SaudeSegurancaDelete(data, success, error);

        return;
    }
}

function DeleteExperiencia(param, action) {
    if (param.cdExperiencia !== 0 && param.cdCandidato !== null) {
        data = {
            url: `/ExperienciaCandidato/${param.cdExperiencia}/${param.cdCandidato}`, body: null
        };

        const error = (response) => {
            ShowMessage('error', response.message);
        };

        const success = (response) => {
            if (response.success) {
                ShowMessage('success', 'Experiência removida com sucesso!');

                action();
            }
            else {
                ShowMessage('error', response.message);
            }
        };

        SaudeSegurancaDelete(data, success, error);

        return;
    }
}

function LoadFilhosData(data) {
    const filhos = data || [];
    if (filhos) {
        slbFilho.option('value', filhos.length > 0);
        slbNumeroFilho.option('value', filhos.length);

        filhos.forEach((item, index) => {
            $(`#hiddenCdFilho${index + 1}`).val(item.cdFilho);
            $(`#txtNomeFilho${index + 1}`).dxTextBox('instance').option('value', item.dsNome);
            $(`#nbbIdadeFilho${index + 1}`).dxNumberBox('instance').option('value', item.stIdade);
        });
    }
}

function LoadCursoData(data) {
    const list = data || [];

    const cursos = list.filter(f => f.stTipoFormacao === 1) || [];
    grdCurso.option('visible', cursos.length !== 0 ? true : false);
    grdCurso.option('dataSource', cursos);

    const idiomas = list.filter(f => f.stTipoFormacao === 2) || [];
    grdIdioma.option('visible', idiomas.length !== 0 ? true : false);
    grdIdioma.option('dataSource', idiomas);

    const extra = list.filter(f => f.stTipoFormacao === 3) || [];
    grdExtra.option('visible', extra.length !== 0 ? true : false);
    grdExtra.option('dataSource', extra);
}

function LoadExperienciaData(data) {
    const experiencias = data || [];

    grdExperiencia.option('visible', experiencias.length !== 0 ? true : false);
    grdExperiencia.option('dataSource', experiencias);
}

function LoadData(data) {
    if (data) {
        $('#hiddenCdCandidato').val(parseInt(data.cdCandidato));

        const components = [txtCpf, txtNome, rdbGenero, dtbNascimento, slbEstadoCivil, slbNacionalidade, txtCep, txtEndereco,
            nbbNumero, txtComplemento, txtBairro, txtCidade, slbEstado, txtNaturalidade, slbEstadoNaturalidade, nbbPeso, nbbAltura,
            nbbCalca, nbbCamisa, nbbSapato, txtFone, txtCelular, txtRecado, txtEmail, txtLinkedIn, txtNomePai, slbPaiNacionalidade,
            txtNomeMae, slbMaeNacionalidade, txtConjuge, slbNacionalidadeConjuge, slbDeficiencia, slbFilho, txtDeficiencia,
            txtCarteiraTrabalho, nbbSerie, slbEstadoEmissor, txtTitulo, txtZona, txtSessao, txtReservista, txtHabilitacao,
            slbCategoria, txtRg, dtbRgEmissao, txtRgEmissor, txtRgOrgaoClasse, nbbRgNumRegistro, txtPis, slbGrauInstrucao,
            chkAgencia, txtAgencia, chkInternet, chkSine, chkOutraForma, txtOutraForma, chkIndicacao, txtNomeIndicacao, txtCargoIndicacao,
            txtUnidadeIndicacao, slbJaTrabalhou, txtCargoTrabalhado, txtAreaTrabalhada, txtChefeTrabalhado, slbTrabalharHoraExtra,
            slbHorarioDesejado, slbPretensaoSalarial, txaDescricaoPessoal, slbCargo

        ];
        const values = [data.stCpf, data.dsNome, data.stGenero, moment(data.dtNascimento).format('yyyy-MM-DD'), data.dsEstadoCivil,
        data.dsNacionalidade, data.stCep, data.dsEndereco, data.stNumero, data.dsComplemento, data.dsBairro, data.dsCidade, data.dsEstado,
        data.dsNaturalidade, data.dsEstadoNaturalidade, data.stPeso, data.stAltura, data.stCalca, data.stCamisa, data.stSapato, data.dsFone,
        data.dsCelular, data.dsRecado, data.dsEmail, data.dsLinkedIn, data.dsNomePai, data.dsNacionalidadePai, data.dsNomeMae,
        data.dsNacionalidadeMae, data.dsNomeConjuge, data.dsNacionalidadeConjuge, data.stPossuiDeficiencia, data.stPossuiFilhos, data.dsDeficiencia,
        data.stCTPS, data.stSerieCTPS, data.stEstadoCTPS, data.stTitulo, data.stZona, data.stSessao, data.stReservista, data.stCNH, data.stCategoriaCNH.trim(),
        data.stRG, data.dtEmissaoRG, data.dsOrgaoEmissorRG, data.dsOrgaoClasse, data.stNumeroRegistro, data.stPIS, data.dsGrauInstrucao,
        data.stAgencia, data.dsAgencia, data.stInternet, data.stSine, data.stOutraIndicacao, data.dsOutraIndicacao, data.stIndicacao,
        data.dsNomeIndicacao, data.dsCargoIndicacao, data.dsUnidadeIndicacao, data.stTrabalhouAntes, data.dsCargoTrabalhado, data.dsAreaTrabalhada,
        data.dsChefeTrabalhado, data.stTrabalhaHoraExtra, data.dsHorarioPreferencia, data.dsPretensaoSalarial, data.dsDescricaoPessoal, data.cdCargo
        ];

        CheckAndSetValues(components, values);

        LoadFilhosData(data.filhoCandidato);
        LoadCursoData(data.cursoCandidato);
        LoadExperienciaData(data.experienciaCandidato);
    }
}

function Next(currentId, nextId) {
    $(`#${currentId}`).click();
    $(`#${nextId}`).click();
}

function LoginCurriculum() {
    const url = '/Login/GenerateTokenCandidato';
    const success = (response) => {
        if (response.success) {
            if (response.data.authenticated) {
                InitializeComponents();
            }
            else {
                ShowMessage('error', 'Por favor, atualize a página!');
            }
        }
        else {
            ShowMessage('error', 'Erro na geração do token anônimo:' + response.message);
        }
    };
    const error = (response) => {
        ShowMessage('error', 'Erro na geração do token anônimo:' + response.message);
    };

    Post(url, null, success, error).then(x => { });
}

function SendValidation(candidato) {
    if (candidato.cdCandidato !== 0) {
        const data = {
            candidato: {
                cdCandidato: candidato.cdCandidato,
                dsEmail: candidato.dsEmail
            },
            origin: 1
        };
        const body = {
            url: '/Candidato/send-validation/', body: JSON.stringify(data)
        };

        const success = (response) => {
            if (response.success) {
                const parts = candidato.dsEmail.split('@');
                const encryptEmail = `${parts[0].substring(0, 5)}...@${parts[1]}`;
                const message = `Olá ${candidato.dsNome}, enviamos um código de validação para ${encryptEmail}.`;

                $('#h4Mensagem').text(message);
                let txtAcessCode = DxTextBox({ id: 'txtAccessCode' }, {
                    maxLength: 6,
                    onValueChanged: (e) => {
                        btnValidarAutenticacao.option('disabled', e.value.length !== 6);
                    }
                });
                DxButton({ id: 'btnCancelarAutenticacao' }, {
                    icon: 'arrowleft',
                    text: 'Cancelar',
                    type: 'normal',
                    onClick: () => {
                        $('#modalAutenticacaoCandidato').modal('hide');

                        InitializeComponents();
                    }
                });
                let btnValidarAutenticacao = DxButton({ id: 'btnValidarAutenticacao' }, {
                    icon: 'check',
                    text: 'Validar',
                    type: 'default',
                    disabled: true,
                    onClick: () => {
                        //Validate
                        if (txtAcessCode.option('value').length === 6) {
                            const bodyValidation = {
                                url: `/Candidato/validate/${data.candidato.cdCandidato}/${txtAcessCode.option('value')}`, body: null
                            };
                            const successValidation = (responseValidation) => {
                                if (responseValidation.success) {
                                    ShowMessage('success', 'Código validado com sucesso.');
                                    LoadData(responseValidation.data);

                                    $('#modalAutenticacaoCandidato').modal('hide');
                                } else {
                                    ShowMessage('error', responseValidation.message);
                                    txtAcessCode.option('value', '');
                                }
                            };

                            SaudeSegurancaGet(bodyValidation, successValidation, error).then(x => { });
                        }
                    }
                });

                $('#modalAutenticacaoCandidato').modal({ backdrop: 'static' });
            }
            else {
                ShowMessage('error', response.message);
            }
        };

        SaudeSegurancaPost(body, success, error).then(x => { });
    }
}

function checkLocalData() {
    const data = JSON.stringify(localStorage.getItem(localKey));
    if (data && moment().diff(moment(data.expiration), 'hours') > 24) {
        localStorage.clear();
    }
}
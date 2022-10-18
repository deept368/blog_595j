import{_ as o}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as r,d as s,a as e,e as n,b as t,f as d,r as h}from"./app.134da205.js";const c="/blog/assets/transformer.e3c7f3ea.png",l="/blog/assets/multi_head_attention.f0d433d6.png",p="/blog/assets/dot_product.ad410765.png",m="/blog/assets/eq_2.d1266654.png",u="/blog/assets/initial_weight_matrix.08027d33.png",f="/blog/assets/ran.e949f9e3.png",g="/blog/assets/recurrent_transition.1f2e5238.png",y="/blog/assets/main_result.d630b0f7.png",b="/blog/assets/speed_up.08872f1b.png",w="/blog/assets/visual_attention.2f673af7.png",A="/blog/assets/visual_layer.2d66c0a0.png",_={},v=e("p",null,"\u200BUpon its emergence, the Transformer Neural Networks [1] dominates the sequence-to-sequence tasks. It even outperforms the Google Neural Machine Translation model in specific tasks. Specifically, the multi-head attention mechanism that depends on element-wise dot-product is deemed as one of the critical building blocks to get things to work. But is it really that important?",-1),N=e("p",null,"Reading Time: About 10 minutes.",-1),R=t("Paper\uFF1A"),T={href:"https://aclanthology.org/2021.emnlp-main.258/",target:"_blank",rel:"noopener noreferrer"},k=t("https://aclanthology.org/2021.emnlp-main.258/"),x=t("Github: "),M={href:"https://github.com/lemon0830/RAN",target:"_blank",rel:"noopener noreferrer"},L=t("https://github.com/lemon0830/RAN"),I=d('<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>A recent work that appeared at the 2021 Conference of Empirical Methods in Natural Language Processing, dives into analyzing the efficacy of the dot-product self-attention module. As recent research has shown that most attention heads only learn simple positional patterns, this paper steps further towards this line and propose a novel substitute mechanism for self-attention: Recurrent AtteNtion (RAN).</p><p>The basic idea of RAN is to directly learn attention weights without any token-to-token interaction and perform layer-to-layer interaction. By performing a massive number of experiments on 10 machine translation tasks, this paper empirically proves that the RAN models are competitive and outperform their Transformer counterparts in certain scenarios, with fewer parameters and inference time. Specifically, applying RAN to the decoder of Transformer yields consistent improvements by about +0.5 BLEU on 6 translation tasks and +1.0 BLEU on Turkish-English translation tasks.</p><p>This blog post is organized in the following way: 1) Brief introduction of the Transformer Neural Network, with a focus on the basics of the multi-head self-attention module 2) Problem associated with the self-attention module 3) The solution provided by the RAN mechanism 4) The performance and analysis of RAN.</p><h2 id="multi-head-attention-module" tabindex="-1"><a class="header-anchor" href="#multi-head-attention-module" aria-hidden="true">#</a> Multi-head Attention Module</h2><p><img src="'+c+'" alt="image1"></p><p>The figure above gives an overview of the Transformer Architecture. The left-hand side provides the encoder architecture, while the right-hand side gives the decoder architecture. Both of the encoder and decoder are stacked by N sub-layers, and the multi-head attention module is the main component in both the encoder and decoder layer. The encoder encodes the inputs and generates the context vector, which serves as an input to the decoder for decoding the output sequences. We refer the interested readers to the original paper [1] and only focus on the Multi-Head Attention module in this article.</p><p><img src="'+l+'" alt="image2"></p><p>The figure above depicts the computation of the dot-product self-attention of the <code>k</code>-th head in the <code>l</code>-th encoder layer. Given a sequence of token representations with a length of <code>n</code>, the self-attention model first converts the representations into three matrice <code>Q</code>, <code>K</code> and <code>V</code>, representing queries, keys, and values, respectively. And <code>d_k</code> is the dimensionality of the vector in the <code>k</code>-th head. Then, the attention matrix is calculated via the dot product of queries and keys followed by rescaling:</p><p><img src="'+p+'" alt="image3"></p><p>Finally, a softmax operation is applied on this unnormalized attention matrix, and then the output is used to compute a weighted sum of values:</p><p><img src="'+m+'" alt="image4"></p><p>where <code>H</code> is a new contextual representation of the <code>l</code>-th layer. This procedure can be implemented with a multi-head mechanism by projecting the input into different subspaces, which requires extra splitting and concatenation operations. The output is fed into a position-wise feed-forward network to get the final representations of this layer.</p><h2 id="problem-associated-with-the-self-attention" tabindex="-1"><a class="header-anchor" href="#problem-associated-with-the-self-attention" aria-hidden="true">#</a> Problem Associated with the Self-attention</h2><p>While flexible, it has been proven that there exists redundant information with pair-wise calculation. Many studies have shown that pairwise self-attention is over-parameterized, leading to a costly inference [2, 3, 4]. The RAN method takes this direction to an extreme by showing that self-attention is empirically replaceable. And next, we will formally introduce the RAN method.</p><h2 id="ran-recurrent-attention" tabindex="-1"><a class="header-anchor" href="#ran-recurrent-attention" aria-hidden="true">#</a> RAN: Recurrent Attention</h2><p>RAN consists of a set of global <code>Initial Attention Matrices</code> and a <code>Recurrent Transition Module</code>. Instead of computing the attention weights on the fly as in the original multi-head attention module in each layer, RAN directly learn the attention weights, denoted as</p><p><img src="'+u+'" alt="image6"></p><p>which are exactly the so-called <code>Initial Attention Matrices</code>. Here <code>h</code> denotes the number of heads. On the other hand, the <code>Recurrent Transition Module</code> takes the set of <code>A0</code> as input, and recursively updates the attention matrices layer by layer. Note that the <code>Initial Attention Matrices</code>, the <code>Recurrent Transition Module</code>, and the other modules are optimized jointly. The attention matrices are completely agnostic to the input representations and can be retrieved directly without recomputation during inference.</p><p><img src="'+f+'" alt="image7"></p><p>Figure above gives the model architecture of the RAN, where the dotted line denotes parameter sharing. It also shows the computation of the <code>k</code>-th head in the <code>l</code>-th encoder layer. The recurrent transition module obtains the attention weights in <code>l</code>-th layer <code>Rec(\u2217)</code> with the attention matrix from the last layer.</p><p>Moreover, the <code>Recurrent Transition Module</code> is implemented using a single feed-forward network with tanh as its activation function followed by a layer normalization and a residual connection:</p><p><img src="'+g+'" alt="image8"></p><p>Notably, the parameters of the transition module are shared across all heads and all layers.</p><h2 id="effectiveness-and-analysis-of-the-ran" tabindex="-1"><a class="header-anchor" href="#effectiveness-and-analysis-of-the-ran" aria-hidden="true">#</a> Effectiveness and Analysis of the RAN.</h2><h3 id="_1-main-results" tabindex="-1"><a class="header-anchor" href="#_1-main-results" aria-hidden="true">#</a> 1. Main results</h3><p>The original paper evaluates RAN on WMT and NIST translation tasks, including 10 different language pairs altogether. Besides, the authors tried to apply RAN to the encoder (RAN-E), the decoder (RAN-D), or both of them (RAN-ALL), respectively. They compare against the standard Transformer (TransF) [1], and the two most related works are Hard-coded Transformer (HCSA) [5] and Random Synthesizer. (Syn-R) [6].</p><p>Table 1 shows the overall results on the ten language pairs. Compared with TransF, the RAN models consistently yield competitive or even better results against TransF on all datasets. Concretely, 0.13/0.16, 0.48/0.44, and 0.16/0.22 more average BLEU/SacreBLEU are achieved by RAN-E, RAND, and RAN-ALL, respectively. Although different languages have different linguistic and syntactic structures, RAN can learn reasonable global attention patterns over the whole training corpus.</p><p><img src="'+y+'" alt="image9"></p><p>Interestingly, RAN-D performs best, which significantly outperforms the TransF on most language pairs. The biggest performance gain comes from the low resource translation task Tr\u21D2En where RAN-D outperforms TransF by 0.97/1.0 BLEU/SacreBLEU points. We conjecture that the position-based attention without tokenwise interaction is easier to learn and the RAN can capture more generalized attention patterns. By contrast, the dot-product self-attention is forced to learn the semantic relationship between tokens and may fall into sub-optimal local minima, especially when the training scale is low. In brief, the improvement indicates that NMT systems can benefit from simplified decoders when training data is insufficient. Besides, although both RAN-E and RAN-D are effective, their effects can not be accumulated.</p><p>Moreover, we can see that RAN-ALL vastly outperforms the other two related methods. RAN bridges the performance gap between Transformer and the models without the dot-product self-attention, demonstrating the effectiveness of RAN. And from the figure below, we can see that RAN-ALL successfully speeds up the inference phase.</p><p><img src="'+b+'" alt="image10"></p><h3 id="_2-analysis" tabindex="-1"><a class="header-anchor" href="#_2-analysis" aria-hidden="true">#</a> 2. Analysis</h3><p>The figure below visualizes the attention patterns of RAN over positions</p><p><img src="'+w+'" alt="image11"></p><p>We find that in the encoder, RAN focuses its attention on a local neighborhood around each position. Specifically, in the last layer of the encoder, the weights become more concentrated, potentially due to the hidden representations being contextualized. Interestingly, except attending local windows to the current position, the decoder weights are most concentrated in the first token of target sequences. This may demonstrate the mechanism of decoder self-attention that the RAN decoder attends to source-side hidden states based on global source sentence representations aggregated by the start tokens.</p><p><img src="'+A+'" alt="image12"></p><p>The figure above depicts the Jensen-Shannon divergence of attention between each pair of layers. The conclusions are as follows: First, the attention similarity in TransF is not salient, but the attention distribution of adjacent layers is similar to some extent. Second, there are no noticeable patterns found in Syn-R. Third, as for RAN-ALL, the attention similarity is high, especially in the decoder (the JS-divergence ranges from 0.08 to 0.2), and is remarkable between adjacent layers.</p><h2 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h2><p>The RAN architecture is proposed to simplify the Transformer architecture for Neural Machine Translation without costly dot-product self-attention. It takes the <code>Initial Attention Matrices</code> as a whole and updates it by a <code>Recurrent Transition Module recurrently</code>. Experiments on ten representative translation tasks show the effectiveness of RAN.</p><h2 id="references" tabindex="-1"><a class="header-anchor" href="#references" aria-hidden="true">#</a> References</h2><p>[1] Vaswani, Ashish, et al. &quot;Attention is all you need.&quot; Advances in neural information processing systems. 2017.</p><p>[2] Sanh, Victor, et al. &quot;DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter.&quot; arXiv preprint arXiv:1910.01108 (2019).</p><p>[3] Correia, Gon\xE7alo M., et al. &quot;Adaptively sparse transformers.&quot; arXiv preprint arXiv:1909.00015 (2019).</p><p>[4] Xiao, Tong, et al. Sharing attention weights for fast transformer. In Proceedings of IJCAI 2019, pages 5292\u20135298.</p><p>[5] You, Weiqiu, et al. Hard-coded gaussian attention for neural machine translation. In Proceedings of ACL 2020, pages 7689\u20137700.</p><p>[6] Tay, Yi, et al. &quot;Synthesizer: Rethinking self-attention for transformer models.&quot; International Conference on Machine Learning. PMLR, 2021.</p>',47);function E(S,q){const a=h("ExternalLinkIcon");return i(),r("div",null,[v,s(" more "),N,e("p",null,[R,e("a",T,[k,n(a)])]),e("p",null,[x,e("a",M,[L,n(a)])]),I])}const C=o(_,[["render",E],["__file","index.html.vue"]]);export{C as default};
